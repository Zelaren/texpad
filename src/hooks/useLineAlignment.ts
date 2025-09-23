import { useCallback, useState } from 'react'
import Quill from 'quill'

export interface LineInfo {
  line: number
  span: number
  content: string
  isHeader: boolean
  headerLevel?: number
}

export function useLineAlignment(lineHeightPx = 30, quillRef?: React.MutableRefObject<Quill | null>) {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentLineInfo, setCurrentLineInfo] = useState<LineInfo>({
    line: 0,
    span: 1,
    content: '',
    isHeader: false
  })

  const getLineInfoAtPosition = useCallback((y: number): LineInfo => {
    if (!quillRef?.current) {
      const lineNum = Math.floor(y / lineHeightPx)
      return { line: lineNum, span: 1, content: '', isHeader: false }
    }

    const quill = quillRef.current
    const simpleLineNum = Math.floor(y / lineHeightPx)

    // 获取编辑器中所有行的信息，构建行映射
    const lines = quill.getLines(0, quill.getLength())
    const lineMap: Array<{startLine: number, span: number, isHeader: boolean, headerLevel?: number, content: string}> = []
    
    let currentLineStart = 0
    let accumulatedLines = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] as { length: () => number; domNode?: { textContent?: string } }
      
      // 修复：只获取该行开始位置的格式，避免范围错误
      const formats = quill.getFormat(currentLineStart, 0)
      const isHeader = formats.header !== undefined
      const headerLevel = typeof formats.header === 'number' ? formats.header : 1
      
      // 根据标题级别确定占用的行数
      let span = 1
      if (isHeader) {
        switch (headerLevel) {
          case 1: span = 3; break
          case 2: span = 2; break
          default: span = 1; break
        }
      }
      
      // 获取文本内容
      let content = ''
      if (line.domNode) {
        content = line.domNode.textContent || ''
      }
      
      // 记录这个块的起始行号和跨度
      lineMap.push({
        startLine: accumulatedLines,
        span,
        isHeader,
        headerLevel,
        content
      })
      
      accumulatedLines += span
      currentLineStart += line.length() + 1 // +1 for newline
    }

    // 找到鼠标位置所在的块
    for (const block of lineMap) {
      const blockStart = block.startLine * lineHeightPx
      const blockEnd = (block.startLine + block.span) * lineHeightPx
      
      if (y >= blockStart && y < blockEnd) {
        return {
          line: block.startLine,
          span: block.span,
          content: block.content,
          isHeader: block.isHeader,
          headerLevel: block.headerLevel
        }
      }
    }

    // 如果没有找到对应的块，返回默认
    return { line: simpleLineNum, span: 1, content: '', isHeader: false }
  }, [lineHeightPx, quillRef])

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) return

    const relativeY = e.clientY - rect.top
    const lineInfo = getLineInfoAtPosition(relativeY)

    // 计算工具按钮应该对齐的位置
    const blockStartLine = lineInfo.line
    let centerLine: number

    if (lineInfo.isHeader) {
      // 标题对齐逻辑
      switch (lineInfo.headerLevel) {
        case 1: // H1: 3行，对齐到第2行和第3行的分割线（第2行的底部）
          centerLine = blockStartLine + 2
          break
        case 2: // H2: 2行，对齐到两行之间的中线
          centerLine = blockStartLine + 1
          break
        default: // 其他标题：对齐到第一行中线
          centerLine = blockStartLine + 0.5
          break
      }
    } else {
      // 普通文本：对齐到该行的中线
      centerLine = blockStartLine + 0.5
    }

    const buttonY = centerLine * lineHeightPx - 12 // 12是按钮高度的一半
    const alignedLine = Math.floor(buttonY / lineHeightPx)

    setCurrentLine(alignedLine)
    setCurrentLineInfo(lineInfo)
  }, [lineHeightPx, getLineInfoAtPosition])

  return { 
    currentLine, 
    setCurrentLine,
    currentLineInfo,
    handleMouseMove,
    getLineSpanAtPosition: getLineInfoAtPosition
  }
}


