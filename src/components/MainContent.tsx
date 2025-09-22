import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import ChartBlot from '../utils/ChartBlot'
import 'quill/dist/quill.snow.css'
import AlignmentGuides from './AlignmentGuides'
import InlineToolbar from './InlineToolbar'
import { useQuillEditor } from '../hooks/useQuillEditor'
import { useLineAlignment } from '../hooks/useLineAlignment'

interface MainContentProps {
  quillInstance: React.MutableRefObject<Quill | null>
}

// AI 生成功能暂未实现

const MainContent: React.FC<MainContentProps> = ({ quillInstance }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const { currentLine, setCurrentLine, handleMouseMove } = useLineAlignment(30)
  const { containerRef } = useQuillEditor(quillInstance, {
    beforeCreate: () => {
      Quill.register({ 'formats/chart': ChartBlot })
    },
    placeholder: '开始书写...'
  })

  useEffect(() => {
    if (!quillInstance.current) return
    quillInstance.current.on('selection-change', (range) => {
      if (range) {
        const bounds = quillInstance.current!.getBounds(range.index)
        if (bounds) {
          const lineHeight = 30
          const currentLineNumber = Math.floor((bounds.top + bounds.height / 2) / lineHeight)
          setCurrentLine(currentLineNumber)

          const [line] = quillInstance.current!.getLine(range.index)
          const lineText = (line as any)?.domNode?.textContent || ''

          if ((range.length === 0 && range.index === 0) || (lineText.trim() === '' && bounds.left < 50)) {
            setShowToolbar(true)
          } else {
            setShowToolbar(false)
          }
        }
      } else {
        setShowToolbar(false)
      }
    })

    const editorElement = quillInstance.current.root as HTMLElement
    editorElement.style.lineHeight = '30px'
    editorElement.style.fontSize = '14px'

    const demoContent = [
      { insert: '欢迎使用图文图表制作工具' },
      { insert: '\n', attributes: { header: 1 } },
      { insert: '这是一个功能演示文档' },
      { insert: '\n', attributes: { header: 2 } },
      { insert: '小标题示例' },
      { insert: '\n', attributes: { header: 3 } },
      { insert: '这是普通段落文本，用于展示正常的文字显示效果。' },
      { insert: '\n' },
      { insert: '这是粗体文本', attributes: { bold: true } },
      { insert: '，这是' },
      { insert: '斜体文本', attributes: { italic: true } },
      { insert: '，这是' },
      { insert: '粗斜体文本', attributes: { bold: true, italic: true } },
      { insert: '。' },
      { insert: '\n' },
      { insert: '有序列表示例：' },
      { insert: '\n' },
      { insert: '第一项内容' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: '第二项内容' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: '第三项内容' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: '\n' },
      { insert: '无序列表示例：' },
      { insert: '\n' },
      { insert: '项目一' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: '项目二' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: '项目三' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: '\n' },
      { insert: '点击左侧的 + 按钮可以添加更多格式或插入图表。' },
      { insert: '\n' }
    ]
    quillInstance.current.setContents(demoContent)
  }, [quillInstance, setCurrentLine])

  const handleFormatClick = (format: string, value?: any) => {
    if (!quillInstance.current) return

    const range = quillInstance.current.getSelection()
    if (range) {
      // 先聚焦到编辑器
      quillInstance.current.focus()

      // 应用格式
      if (format === 'header') {
        quillInstance.current.format('header', value)
      } else if (format === 'bold') {
        const currentFormat = quillInstance.current.getFormat()
        quillInstance.current.format('bold', !currentFormat.bold)
      } else if (format === 'italic') {
        const currentFormat = quillInstance.current.getFormat()
        quillInstance.current.format('italic', !currentFormat.italic)
      } else if (format === 'list') {
        quillInstance.current.format('list', value)
      } else if (format === 'normal') {
        // 恢复为普通段落
        quillInstance.current.format('header', false)
        quillInstance.current.format('list', false)
      }

      // 保持选择状态，让用户可以继续输入
      setTimeout(() => {
        if (quillInstance.current) {
          quillInstance.current.setSelection(range)
        }
      }, 10)
    }
    setShowToolbar(false)
  }

  // 图片上传并插入到编辑器
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImageUploadClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!quillInstance.current) return
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      const range = quillInstance.current.getSelection(true)
      const insertIndex = range ? range.index : quillInstance.current.getLength()
      quillInstance.current.insertEmbed(insertIndex, 'image', dataUrl, Quill.sources.USER)
      quillInstance.current.setSelection(insertIndex + 1, 0, Quill.sources.SILENT)
    } catch (err) {
      console.error('Failed to insert image:', err)
    } finally {
      // 清空 input 以便下次选择同一文件也会触发 change
      if (imageInputRef.current) imageInputRef.current.value = ''
      setShowToolbar(false)
    }
  }

  // 鼠标移动仅更新当前行号

  const handleEditorMouseMove = handleMouseMove

  const handleEditorMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!quillInstance.current) return
    const root = quillInstance.current.root as HTMLElement
    const rect = root.getBoundingClientRect()
    const lineHeight = 30
    const lineNum = Math.floor((e.clientY - rect.top) / lineHeight)

    // 计算该行的起始 index
    const q: any = quillInstance.current as any
    const lines = q.getLines(0, Number.MAX_SAFE_INTEGER) || []
    if (lines.length === 0) {
      quillInstance.current.setSelection(0, 0, Quill.sources.SILENT)
      return
    }
    const clamped = Math.max(0, Math.min(lineNum, lines.length - 1))

    let startIndex = 0
    for (let i = 0; i < clamped; i++) {
      const len = typeof lines[i]?.length === 'function' ? lines[i].length() : 1
      startIndex += (len + 1) // 包含换行
    }
    const lineLen = typeof lines[clamped]?.length === 'function' ? lines[clamped].length() : 0

    // 空行：直接定位到行首
    if (lineLen === 0) {
      e.preventDefault()
      quillInstance.current.focus()
      requestAnimationFrame(() => quillInstance.current!.setSelection(startIndex, 0, Quill.sources.SILENT))
      return
    }

    // 根据水平位置定位到最近字符（二分查找）
    const targetX = e.clientX - rect.left
    let low = 0
    let high = lineLen
    let bestOffset = 0
    let bestDist = Number.POSITIVE_INFINITY
    const getLeftAt = (offset: number) => {
      const b = quillInstance.current!.getBounds(startIndex + offset)
      return (b && typeof b.left === 'number') ? b.left : 0
    }
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const left = getLeftAt(mid)
      const dist = Math.abs(left - targetX)
      if (dist < bestDist) {
        bestDist = dist
        bestOffset = mid
      }
      if (left < targetX) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    e.preventDefault()
    quillInstance.current.focus()
    requestAnimationFrame(() => quillInstance.current!.setSelection(startIndex + bestOffset, 0, Quill.sources.SILENT))
  }

  // 插入一个 AntV/G2 示例到编辑器
  const handleInsertSampleChart = () => {
    if (!quillInstance.current) return
    const sampleConfig = {
      data: [
        { category: 'Jan', value: 120 },
        { category: 'Feb', value: 200 },
        { category: 'Mar', value: 150 },
        { category: 'Apr', value: 80 },
        { category: 'May', value: 170 },
        { category: 'Jun', value: 220 },
      ],
      type: 'interval',
      xField: 'category',
      yField: 'value',
    }
    const range = quillInstance.current.getSelection(true)
    const insertIndex = range ? range.index : quillInstance.current.getLength()
    quillInstance.current.insertEmbed(insertIndex, 'chart', sampleConfig, Quill.sources.USER)
    // 在图表后补一个换行，便于继续输入
    quillInstance.current.insertText(insertIndex + 1, '\n', Quill.sources.SILENT)
    quillInstance.current.setSelection(insertIndex + 2, 0, Quill.sources.SILENT)
    setShowToolbar(false)
  }

  // 占位：AI 生成功能暂未实现

  // 已拆分 AlignmentGuides 组件

  return (
    <div className="flex-1 flex relative">
      {/* 左侧边距区域 - 增加宽度 */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 relative">
        {/* 工具按钮，紧贴右侧分割线 */}
        <button
          className="absolute right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-700 opacity-50 hover:opacity-100 transition-opacity"
          style={{ top: `${currentLine * 30 + 12}px` }} // 调整为30px间距，与信笺行中心对齐
          onClick={() => setShowToolbar(!showToolbar)}
        >
          +
        </button>

        {/* 工具提示完全显示在左侧空间 */}
        <InlineToolbar
          topPx={currentLine * 30 + 5}
          visible={showToolbar}
          onFormat={handleFormatClick}
          onUploadImage={handleImageUploadClick}
          onInsertChart={handleInsertSampleChart}
          bindFileInput={(el) => (imageInputRef.current = el)}
          onImageChange={handleImageFileChange}
        />
      </div>

      {/* 主要内容区域 - 移除外框和边框 */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* 对齐线背景 */}
        <AlignmentGuides lineHeightPx={30} totalLines={100} />

        {/* 编辑器容器 - 移除边框和内边距 */}
        <div className="relative z-10 h-full" onMouseMove={handleEditorMouseMove} onMouseDown={handleEditorMouseDown}>
          <div ref={containerRef} className="w-full min-h-full outline-none quill-editor" style={{ padding: '6px 24px' }} />
        </div>
      </div>

      {/* 修复的全局样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ql-toolbar {
            display: none !important;
          }

          .ql-container {
            border: none !important;
            font-family: inherit !important;
          }

          .ql-editor {
            border: none !important;
            padding: 0 !important;
          }

          .ql-editor h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor h3 {
            font-size: 1.17em !important;
            font-weight: bold !important;
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor p {
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 14px !important;
          }

          .ql-editor strong {
            font-weight: bold !important;
          }

          .ql-editor em {
            font-style: italic !important;
          }

          .ql-editor ol, .ql-editor ul {
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
            padding-left: 2em !important;
          }

          .ql-editor li {
            line-height: 30px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor .ql-indent-1 {
            padding-left: 3em !important;
          }

          /* 为图表与图片添加白底与边框，遮挡背景分割线 */
          .ql-editor .quill-chart-embed {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important; /* gray-200 */
            border-radius: 6px !important;
            padding: 8px !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            position: relative;
          }

          .ql-editor img {
            display: block;
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 4px !important;
            padding: 4px !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            max-width: 100%;
          }
        `
      }} />
    </div>
  )
}

export default MainContent