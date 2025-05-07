import { CSSProperties, HTMLProps, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePickerActions, usePickerData } from "./Picker"

interface PickerColumnProps extends HTMLProps<HTMLDivElement> {
  name: string
}

const PickerColumnDataContext = createContext<{
  key: string
} | null>(null)
PickerColumnDataContext.displayName = 'PickerColumnDataContext'

export function useColumnData(componentName: string) {
  const context = useContext(PickerColumnDataContext)
  if (context === null) {
    const error = new Error(`<${componentName} /> is missing a parent <Picker.Column /> component.`)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, useColumnData)
    }
    throw error
  }
  return context
}

function PickerColumn({
  style,
  children,
  name: key,
  ...restProps
}: PickerColumnProps) {
  const { height, itemHeight, wheelMode, value: groupValue, optionGroups } = usePickerData('Picker.Column')

  // Caculate the selected index
  const value = useMemo(
    () => groupValue[key],
    [groupValue, key],
  )
  const options = useMemo(
    () => optionGroups[key] || [],
    [key, optionGroups],
  )
  const selectedIndex = useMemo(
    () => {
      let index = options.findIndex((o) => o.value === value)
      if (index < 0) {
        index = 0
      }
      return index
    },
    [options, value],
  )

  // Caculate the translate of scroller
  const minTranslate = useMemo(
    () => height / 2 - itemHeight * options.length + itemHeight / 2,
    [height, itemHeight, options],
  )
  const maxTranslate = useMemo(
    () => height / 2 - itemHeight / 2,
    [height, itemHeight],
  )
  const [scrollerTranslate, setScrollerTranslate] = useState<number>(0)
  useEffect(() => {
    setScrollerTranslate(height / 2 - itemHeight / 2 - selectedIndex * itemHeight)
  }, [height, itemHeight, selectedIndex])

  // A handler to trigger the value change
  const pickerActions = usePickerActions('Picker.Column')
  const translateRef = useRef<number>(scrollerTranslate)
  translateRef.current = scrollerTranslate
  const handleScrollerTranslateSettled = useCallback(() => {
    let nextActiveIndex = 0
    const currentTrans = translateRef.current
    if (currentTrans >= maxTranslate) {
      nextActiveIndex = 0
    } else if (currentTrans <= minTranslate) {
      nextActiveIndex = options.length - 1
    } else {
      nextActiveIndex = -Math.round((currentTrans - maxTranslate) / itemHeight)
    }

    const changed = pickerActions.change(key, options[nextActiveIndex].value)
    if (!changed) {
      setScrollerTranslate(height / 2 - itemHeight / 2 - nextActiveIndex * itemHeight)
    }
  }, [pickerActions, height, itemHeight, key, maxTranslate, minTranslate, options])

  // Handle touch events
  const [startScrollerTranslate, setStartScrollerTranslate] = useState<number>(0)
  const [isMoving, setIsMoving] = useState<boolean>(false)
  const [startTouchY, setStartTouchY] = useState<number>(0)

  // Modified to snap to steps while moving
  const updateScrollerWhileMoving = useCallback((nextScrollerTranslate: number) => {
    if (nextScrollerTranslate < minTranslate) {
      nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8)
    } else if (nextScrollerTranslate > maxTranslate) {
      nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8)
    } else {
      // Snap to the nearest step while moving
      const currentStep = Math.round((maxTranslate - nextScrollerTranslate) / itemHeight)
      nextScrollerTranslate = maxTranslate - currentStep * itemHeight
    }
    setScrollerTranslate(nextScrollerTranslate)
  }, [maxTranslate, minTranslate, itemHeight])

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    setStartTouchY(event.targetTouches[0].pageY)
    setStartScrollerTranslate(scrollerTranslate)
  }, [scrollerTranslate])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault()
    }

    if (!isMoving) {
      setIsMoving(true)
    }

    const touchDelta = event.targetTouches[0].pageY - startTouchY
    // Calculate next scroll position
    const rawNextScrollerTranslate = startScrollerTranslate + touchDelta
    
    // Only update if moved enough to warrant a step change
    if (Math.abs(touchDelta) > itemHeight / 2) {
      updateScrollerWhileMoving(rawNextScrollerTranslate)
    }
  }, [isMoving, startScrollerTranslate, startTouchY, updateScrollerWhileMoving, itemHeight])

  const handleTouchEnd = useCallback(() => {
    if (!isMoving) {
      return
    }
    setIsMoving(false)
    setStartTouchY(0)
    setStartScrollerTranslate(0)

    handleScrollerTranslateSettled()
  }, [handleScrollerTranslateSettled, isMoving])

  const handleTouchCancel = useCallback(() => {
    if (!isMoving) {
      return
    }
    setIsMoving(false)
    setStartTouchY(0)
    setScrollerTranslate(startScrollerTranslate)
    setStartScrollerTranslate(0)
  }, [isMoving, startScrollerTranslate])

  // Handle wheel events
  const wheelingTimer = useRef<number | null>(null)
  const wheelDeltaAccumulator = useRef<number>(0)

  const handleWheeling = useCallback((event: WheelEvent) => {
    if (event.deltaY === 0) {
      return
    }
    
    const direction = Math.sign(event.deltaY)
    wheelDeltaAccumulator.current += Math.abs(event.deltaY)
    
    // Only move to next step when accumulated enough delta
    if (wheelDeltaAccumulator.current >= itemHeight) {
      wheelDeltaAccumulator.current = 0
      
      // Move exactly one item at a time for stepped scrolling
      const delta = direction * itemHeight
      const nextStep = wheelMode === 'normal' ? -direction : direction
      const nextScrollerTranslate = maxTranslate - (
        Math.round((maxTranslate - scrollerTranslate) / itemHeight) + nextStep
      ) * itemHeight
      
      updateScrollerWhileMoving(nextScrollerTranslate)
    }
  }, [itemHeight, scrollerTranslate, updateScrollerWhileMoving, wheelMode, maxTranslate])

  const handleWheelEnd = useCallback(() => {
    wheelDeltaAccumulator.current = 0
    handleScrollerTranslateSettled()
  }, [handleScrollerTranslateSettled])

  const handleWheel = useCallback((event: WheelEvent) => {
    if (wheelMode === 'off') {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    handleWheeling(event)

    if (wheelingTimer.current) {
      clearTimeout(wheelingTimer.current)
    }

    wheelingTimer.current = setTimeout(() => {
      handleWheelEnd()
    }, 200) as unknown as number
  }, [handleWheelEnd, handleWheeling, wheelMode])

  // 'touchmove' and 'wheel' should not be passive
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [handleTouchMove, handleWheel])

  const columnStyle = useMemo<CSSProperties>(
    () => ({
      flex: '1 1 0%',
      maxHeight: '100%',
      transitionProperty: 'transform',
      transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
      transitionDuration: isMoving ? '0ms' : '300ms',
      transform: `translate3d(0, ${scrollerTranslate}px, 0)`,
    }),
    [scrollerTranslate, isMoving],
  )

  const columnData = useMemo(
    () => ({ key }),
    [key],
  )

  return (
    <div
      style={{
        ...columnStyle,
        ...style,
      }}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...restProps}
    >
      <PickerColumnDataContext.Provider value={columnData}>
        {children}
      </PickerColumnDataContext.Provider>
    </div>
  )
}


export default PickerColumn
