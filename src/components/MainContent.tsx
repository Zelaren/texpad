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

const LINE_HEIGHT_PX = 30
const HEADER_LINE_SPANS = {
  h1: 3,
  h2: 2,
  h3: 1,
  h4: 1,
} as const



const MainContent: React.FC<MainContentProps> = ({ quillInstance }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const { currentLine, setCurrentLine, handleMouseMove } = useLineAlignment(LINE_HEIGHT_PX, quillInstance)
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
          const currentLineNumber = Math.floor((bounds.top + bounds.height / 2) / LINE_HEIGHT_PX)
          setCurrentLine(currentLineNumber)
        }
      } else {
        // 保持悬停控制工具栏显示，不在选择变化时强制关闭
      }
    })

    const editorElement = quillInstance.current.root as HTMLElement
    editorElement.style.lineHeight = `${LINE_HEIGHT_PX}px`
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

  const handleFormatClick = (format: string, value?: number | string | boolean) => {
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
    }
  }

  
  const handleEditorMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const editor = quillInstance.current
    if (!editor) return

    const root = editor.root as HTMLElement
    const rect = root.getBoundingClientRect()
    const relativeY = e.clientY - rect.top

    // 检查是否点击在现有内容下方
    const editorHeight = root.scrollHeight
    const isBeyondContent = relativeY >= editorHeight

    if (isBeyondContent) {
      // 如果点击在内容下方，定位到文档末尾
      const lastPosition = editor.getLength()
      editor.setSelection(lastPosition, 0, Quill.sources.SILENT)
      editor.focus()

      // 更新当前行号
      const lastLine = Math.floor(editorHeight / LINE_HEIGHT_PX)
      setCurrentLine(lastLine)
      return
    }

    // 对于内容区域内的点击，让浏览器处理默认行为
    // 然后通过 selection-change 事件来更新行号
    editor.focus()

    // 延迟检查光标位置，确保浏览器已经完成默认定位
    setTimeout(() => {
      const range = editor.getSelection()
      if (range) {
        const bounds = editor.getBounds(range.index)
        if (bounds) {
          const currentLineNumber = Math.floor((bounds.top + bounds.height / 2) / LINE_HEIGHT_PX)
          setCurrentLine(currentLineNumber)
        }
      }
    }, 10)
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
  }

  // 占位：AI 生成功能暂未实现

  // 已拆分 AlignmentGuides 组件

  return (
    <div className="flex-1 flex relative">
      {/* 左侧边距区域 - 增加宽度 */}
      <div
        className="w-64 bg-gray-50 border-r border-gray-200 relative"
        onMouseEnter={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        {/* 工具按钮，紧贴右侧分割线 */}
        <button
          className="absolute right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-700 opacity-50 hover:opacity-100 transition-opacity"
          style={{ top: `${currentLine * LINE_HEIGHT_PX + 12}px` }} // 调整为固定行距
        >
          +
        </button>

        {/* 工具提示完全显示在左侧空间 */}
        <InlineToolbar
          topPx={currentLine * LINE_HEIGHT_PX + 5}
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
        <AlignmentGuides lineHeightPx={LINE_HEIGHT_PX} totalLines={100} />

        {/* 编辑器容器 - 移除边框和内边距 */}
        <div className="relative z-10 h-full" onMouseMove={handleMouseMove}>
          <div
            ref={containerRef}
            className="w-full min-h-full outline-none quill-editor"
            style={{ padding: '6px 24px' }}
            onMouseDown={handleEditorMouseDown}
          />
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
            font-size: 14px !important;
            line-height: ${LINE_HEIGHT_PX}px !important;
          }

          .ql-editor p,
          .ql-editor li,
          .ql-editor ol,
          .ql-editor ul {
            line-height: ${LINE_HEIGHT_PX}px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor p {
            font-size: 14px !important;
          }

          .ql-editor ol,
          .ql-editor ul {
            padding-left: 2em !important;
          }

          .ql-editor li {
            padding-left: 0 !important;
          }

          .ql-editor .ql-indent-1 {
            padding-left: 3em !important;
          }

          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3,
          .ql-editor h4 {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            font-weight: 700 !important;
            line-height: ${LINE_HEIGHT_PX}px !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .ql-editor h1 {
            font-size: 28px !important;
            min-height: ${HEADER_LINE_SPANS.h1 * LINE_HEIGHT_PX}px !important;
          }

          .ql-editor h2 {
            font-size: 22px !important;
            min-height: ${HEADER_LINE_SPANS.h2 * LINE_HEIGHT_PX}px !important;
          }

          .ql-editor h3 {
            font-size: 18px !important;
            min-height: ${HEADER_LINE_SPANS.h3 * LINE_HEIGHT_PX}px !important;
          }

          .ql-editor h4 {
            font-size: 16px !important;
            min-height: ${HEADER_LINE_SPANS.h4 * LINE_HEIGHT_PX}px !important;
          }

          .ql-editor strong {
            font-weight: bold !important;
          }

          .ql-editor em {
            font-style: italic !important;
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
