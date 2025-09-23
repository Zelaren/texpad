import { useCallback } from 'react'
import Quill from 'quill'
import { useEditorStore } from '../store/editorStore'

export interface LineInfo {
  line: number
  span: number
  content: string
  isHeader: boolean
  headerLevel?: number
}

export function useLineAlignment(lineHeightPx = 30, quillRef?: React.MutableRefObject<Quill | null>) {
  const currentLine = useEditorStore((state) => state.currentLine)
  const setCurrentLine = useEditorStore((state) => state.setCurrentLine)
  const currentLineInfo = useEditorStore((state) => state.currentLineInfo)
  const setCurrentLineInfo = useEditorStore((state) => state.setCurrentLineInfo)

  const getLineInfoAtPosition = useCallback((y: number): LineInfo => {
    if (!quillRef?.current) {
      const lineNum = Math.floor(y / lineHeightPx)
      return { line: lineNum, span: 1, content: '', isHeader: false }
    }

    const quill = quillRef.current
    const simpleLineNum = Math.floor(y / lineHeightPx)

    const lines = quill.getLines(0, quill.getLength())
    const lineMap: Array<{ startLine: number; span: number; isHeader: boolean; headerLevel?: number; content: string }> = []

    let currentLineStart = 0
    let accumulatedLines = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] as { length: () => number; domNode?: { textContent?: string } }

      const formats = quill.getFormat(currentLineStart, 0)
      const isHeader = formats.header !== undefined
      const headerLevel = typeof formats.header === 'number' ? formats.header : 1

      let span = 1
      if (isHeader) {
        switch (headerLevel) {
          case 1:
            span = 3
            break
          case 2:
            span = 2
            break
          default:
            span = 1
            break
        }
      }

      let content = ''
      if (line.domNode) {
        content = line.domNode.textContent || ''
      }

      lineMap.push({
        startLine: accumulatedLines,
        span,
        isHeader,
        headerLevel,
        content,
      })

      accumulatedLines += span
      currentLineStart += line.length() + 1
    }

    for (const block of lineMap) {
      const blockStart = block.startLine * lineHeightPx
      const blockEnd = (block.startLine + block.span) * lineHeightPx

      if (y >= blockStart && y < blockEnd) {
        return {
          line: block.startLine,
          span: block.span,
          content: block.content,
          isHeader: block.isHeader,
          headerLevel: block.headerLevel,
        }
      }
    }

    return { line: simpleLineNum, span: 1, content: '', isHeader: false }
  }, [lineHeightPx, quillRef])

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) return

    const relativeY = e.clientY - rect.top
    const lineInfo = getLineInfoAtPosition(relativeY)

    const blockStartLine = lineInfo.line
    let centerLine: number

    if (lineInfo.isHeader) {
      switch (lineInfo.headerLevel) {
        case 1:
          centerLine = blockStartLine + 2
          break
        case 2:
          centerLine = blockStartLine + 1
          break
        default:
          centerLine = blockStartLine + 0.5
          break
      }
    } else {
      centerLine = blockStartLine + 0.5
    }

    const buttonY = centerLine * lineHeightPx - 12
    const alignedLine = Math.floor(buttonY / lineHeightPx)

    setCurrentLine(alignedLine)
    setCurrentLineInfo(lineInfo)
  }, [getLineInfoAtPosition, lineHeightPx, setCurrentLine, setCurrentLineInfo])

  return {
    currentLine,
    currentLineInfo,
    handleMouseMove,
    getLineSpanAtPosition: getLineInfoAtPosition,
    setCurrentLine,
    setCurrentLineInfo,
  }
}


