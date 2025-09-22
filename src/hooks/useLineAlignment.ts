import { useCallback, useState } from 'react'

export function useLineAlignment(lineHeightPx = 30) {
  const [currentLine, setCurrentLine] = useState(0)

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) return
    const lineNum = Math.floor((e.clientY - rect.top) / lineHeightPx)
    setCurrentLine(lineNum)
  }, [lineHeightPx])

  return { currentLine, setCurrentLine, handleMouseMove }
}


