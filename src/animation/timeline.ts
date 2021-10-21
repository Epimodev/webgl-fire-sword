import { invLerp, lerp } from "../utils/math"
import { EasingFunction } from "./easing"

type TimelineValue = { [key: string]: number | TimelineValue }

type TimelineKeyframe = {
  duration: number
  value: number
  easing: EasingFunction
}

type TimelineInterval = {
  start: number
  end: number
  startAt: number
  endAt: number
  easing: EasingFunction
}

type TimelineDefinition<Value extends TimelineValue> = {
  [N in keyof Value]: Value[N] extends TimelineValue
    ? TimelineDefinition<Value[N]>
    : TimelineKeyframe[]
}

type TimelineIntervals<Value extends TimelineValue> = {
  [N in keyof Value]: Value[N] extends TimelineValue
    ? TimelineIntervals<Value[N]>
    : TimelineInterval[]
}

type Timeline<Value extends TimelineValue> = {
  start: () => void
  pause: () => void
  seek: (timestamp: number) => void
  values: Value
}

const deepClone = <V extends TimelineValue>(value: V): V => {
  const clone = { ...value }
  for (const key in clone) {
    const value = clone[key]
    if (typeof value === "object") {
      // @ts-expect-error
      clone[key] = deepClone(value)
    }
  }

  return clone
}

const createIntervals = (
  initial: number,
  keyframes: TimelineKeyframe[],
): TimelineInterval[] => {
  let intervalStart = 0
  let intervalEnd = 0

  return keyframes.map((keyframe, index) => {
    const startValue = index === 0 ? initial : keyframes[index - 1].value
    const endValue = keyframe.value
    intervalEnd += keyframe.duration
    const startAt = intervalStart
    intervalStart = intervalEnd
    return {
      start: startValue,
      end: endValue,
      startAt: startAt,
      endAt: intervalEnd,
      easing: keyframe.easing,
    }
  })
}

const createTimelineIntervals = <V extends TimelineValue>(
  values: V,
  definition: TimelineDefinition<V>,
): TimelineIntervals<V> => {
  // @ts-expect-error object will be filled in for loop
  const intervals: TimelineIntervals<V> = {}

  for (const key in definition) {
    const value = values[key]
    const keyframes = definition[key]
    if (Array.isArray(keyframes)) {
      // @ts-expect-error if keyframes is an array, value should be a number
      intervals[key] = createIntervals(value, keyframes)
    } else {
      // @ts-expect-error
      intervals[key] = createTimelineIntervals(values[key], definition[key])
    }
  }

  return intervals
}

const mutateValues = <V extends TimelineValue>(
  timestamp: number,
  intervals: TimelineIntervals<V>,
  values: V,
  completed = { value: true },
): boolean => {
  for (const key in values) {
    const value = values[key]
    if (typeof value === "number") {
      // @ts-expect-error if value is a number, intervals is an array of keyframes
      const [v, valueCompleted] = getValueAt(timestamp, intervals)
      if (!valueCompleted) {
        completed.value = false
      }
      // @ts-expect-error
      values[key] = v
    } else {
      // @ts-expect-error
      mutateValues(timestamp, intervals[key], values[key], completed)
    }
  }

  return completed.value
}

const getValueAt = (
  timestamp: number,
  intervals: TimelineInterval[],
): [number, boolean] => {
  const interval = intervals.find(
    ({ startAt, endAt }) => timestamp >= startAt && timestamp < endAt,
  )
  // if interval isn't found, it means the timeline is completed
  if (!interval) {
    const value = intervals[intervals.length - 1].end
    return [value, true]
  }
  const timeProgress = invLerp(interval.startAt, interval.endAt, timestamp)
  const valueProgress = interval.easing(timeProgress)
  const value = lerp(interval.start, interval.end, valueProgress)
  return [value, false]
}

export const createTimeline = <V extends TimelineValue>(
  initial: V,
  definition: TimelineDefinition<V>,
  onChange: (values: V) => void,
): Timeline<V> => {
  const values = deepClone(initial)
  let frame: number | undefined = undefined
  let startTimestamp = 0

  const intervals = createTimelineIntervals(initial, definition)

  const seek = (timestamp: number): boolean => {
    const completed = mutateValues(timestamp, intervals, values)
    onChange(values)
    return completed
  }

  const start = () => {
    if (frame === undefined) {
      return
    }
    startTimestamp = Date.now()

    const tick = () => {
      const now = Date.now()
      const timestamp = now - startTimestamp
      const completed = seek(timestamp)

      if (!completed) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = undefined
      }
    }

    frame = requestAnimationFrame(tick)
  }

  const pause = () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)
      frame = undefined
    }
  }

  return {
    start,
    pause,
    seek,
    values,
  }
}
