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

export type TimelineDefinition<Value extends TimelineValue> = {
  [N in keyof Value]: Value[N] extends TimelineValue
    ? TimelineDefinition<Value[N]>
    : TimelineKeyframe[]
}

type TimelineIntervals<Value extends TimelineValue> = {
  [N in keyof Value]: Value[N] extends TimelineValue
    ? TimelineIntervals<Value[N]>
    : TimelineInterval[]
}

export type Timeline<Value extends TimelineValue> = {
  play: () => void
  reverse: () => void
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
      const [v, valueCompleted] = getValueAt(timestamp, intervals[key])
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
  onComplete: (params: Timeline<V>) => void,
): Timeline<V> => {
  const values = deepClone(initial)
  let frame: number | undefined = undefined
  let timestamp = 0
  let timestampOnPlay = 0
  let playedAt = 0

  const intervals = createTimelineIntervals(initial, definition)

  const seek = (newTimestamp: number): boolean => {
    timestamp = newTimestamp
    const completed = mutateValues(timestamp, intervals, values)
    onChange(values)
    return completed
  }

  const play = () => {
    if (frame !== undefined) {
      return
    }
    timestampOnPlay = timestamp
    playedAt = Date.now()

    const tick = () => {
      const now = Date.now()
      const timestampOffset = now - playedAt
      timestamp = timestampOnPlay + timestampOffset
      const completed = seek(timestamp)

      if (!completed) {
        frame = requestAnimationFrame(tick)
      } else {
        onComplete(timeline)
        frame = undefined
      }
    }

    frame = requestAnimationFrame(tick)
  }

  const reverse = () => {
    if (frame !== undefined) {
      return
    }
    timestampOnPlay = timestamp
    playedAt = Date.now()

    const tick = () => {
      const now = Date.now()
      const timestampOffset = now - playedAt
      // avoid negative timestamp
      timestamp = Math.max(0, timestampOnPlay - timestampOffset)
      seek(timestamp)

      if (timestamp > 0) {
        frame = requestAnimationFrame(tick)
      } else {
        onComplete(timeline)
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

  const timeline = {
    play,
    reverse,
    pause,
    seek,
    values,
  }

  return timeline
}
