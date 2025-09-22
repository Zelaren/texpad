import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
// import { Chart } from '@antv/g2' // Remove G2 Chart import
import ChartBlot from '../utils/ChartBlot' // Import ChartBlot
import 'quill/dist/quill.snow.css' // Import Quill styles

interface MainContentProps {
  quillInstance: React.MutableRefObject<Quill | null>
}

// AI 生成功能暂未实现

const MainContent: React.FC<MainContentProps> = ({ quillInstance }) => {
  const quillRef = useRef(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const rafHandleRef = useRef<number | null>(null)

  useEffect(() => {
    if (!quillInstance.current) {
      // Register custom blot before initializing Quill
      Quill.register({
        'formats/chart': ChartBlot
      })

      if (quillRef.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow', // 改为snow主题以支持格式化
          placeholder: '开始书写...',
          modules: {
            toolbar: false // 禁用默认工具栏，使用自定义工具栏
          }
        })

        // 监听选择变化
        quillInstance.current.on('selection-change', (range) => {
          if (range) {
            const bounds = quillInstance.current!.getBounds(range.index)
            if (bounds) {
              const lineHeight = 30 // 对齐线间隔改为30px
              const currentLineNumber = Math.floor((bounds.top + bounds.height/2) / lineHeight)
              setCurrentLine(currentLineNumber)

              // 检查是否在行首且无内容
              const [line] = quillInstance.current!.getLine(range.index)
              const lineText = line?.domNode?.textContent || ''

              if (range.length === 0 && range.index === 0 ||
                  (lineText.trim() === '' && bounds.left < 50)) {
                setShowToolbar(true)
              } else {
                setShowToolbar(false)
              }
            }
          } else {
            setShowToolbar(false)
          }
        })

        // 添加自定义样式
        const editorElement = quillInstance.current.root
        editorElement.style.lineHeight = '30px'
        editorElement.style.fontSize = '14px'

        // 添加演示内容来验证格式化功能
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
      }
    }
  }, [quillInstance])

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

  // 鼠标移动行定位并让光标跟随
  const setCaretToLineStart = (lineNumber: number) => {
    if (!quillInstance.current) return
    const q: any = quillInstance.current as any
    const lines = q.getLines(0, Number.MAX_SAFE_INTEGER) || []
    if (lines.length === 0) {
      q.setSelection(0, 0, Quill.sources.SILENT)
      return
    }
    const clamped = Math.max(0, Math.min(lineNumber, lines.length - 1))
    let index = 0
    for (let i = 0; i < clamped; i++) {
      const len = typeof lines[i]?.length === 'function' ? lines[i].length() : 1
      index += len
    }
    q.setSelection(index, 0, Quill.sources.SILENT)
  }

  const handleEditorMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!quillInstance.current) return
    const root = quillInstance.current.root as HTMLElement
    const rect = root.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) return
    const lineHeight = 30
    const lineNum = Math.floor((e.clientY - rect.top) / lineHeight)
    setCurrentLine(lineNum)

    if (rafHandleRef.current) cancelAnimationFrame(rafHandleRef.current)
    rafHandleRef.current = requestAnimationFrame(() => {
      setCaretToLineStart(lineNum)
    })
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

  // 生成对齐线，间距改为30px
  const generateAlignmentLines = () => {
    const lines = []
    const lineHeight = 30 // 修改为30px
    const totalLines = 100 // 增加总行数以适应更小的间距

    for (let i = 0; i < totalLines; i++) {
      lines.push(
        <div
          key={i}
          className="absolute left-0 right-0 border-b border-blue-100"
          style={{
            top: `${i * lineHeight}px`,
            height: `${lineHeight}px`
          }}
        />
      )
    }
    return lines
  }

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
        {showToolbar && (
          <div
            className="absolute right-12 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-20 flex flex-col space-y-4 w-60"
            style={{
              top: `${currentLine * 30 + 5}px` // 跟随当前行位置
            }}
          >
            {/* 第一行：T/H1/H2/H3/H4/有序/无序 */}
            <div className="grid grid-cols-7 gap-2">
              <button onClick={() => handleFormatClick('normal')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">T</button>
              <button onClick={() => handleFormatClick('header', 1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H1</button>
              <button onClick={() => handleFormatClick('header', 2)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H2</button>
              <button onClick={() => handleFormatClick('header', 3)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H3</button>
              <button onClick={() => handleFormatClick('normal')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H4</button>
              <button onClick={() => handleFormatClick('list', 'ordered')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">有序</button>
              <button onClick={() => handleFormatClick('list', 'bullet')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">无序</button>
            </div>

            {/* 第二行：上传图片 */}
            <div className="flex items-center">
              <button onClick={handleImageUploadClick} className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-center">上传图片</button>
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
            </div>

            {/* 第三行：插入示例图表 + AI 生成（占位） */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <button onClick={handleInsertSampleChart} className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-center">插入示例图表</button>
              <button disabled className="px-3 py-2 bg-gray-100 text-gray-400 rounded text-center cursor-not-allowed">AI 生成（暂未实现）</button>
            </div>
          </div>
        )}
      </div>

      {/* 主要内容区域 - 移除外框和边框 */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* 对齐线背景 */}
        <div className="absolute inset-0 pointer-events-none">
          {generateAlignmentLines()}
        </div>

        {/* 编辑器容器 - 移除边框和内边距 */}
        <div className="relative z-10 h-full" onMouseMove={handleEditorMouseMove}>
          <div
            ref={quillRef}
            className="w-full min-h-full outline-none quill-editor"
            style={{ padding: '6px 24px' }} // 只保留必要的内边距
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
            list-style-position: outside !important;
          }

          .ql-editor ol li {
            list-style-type: decimal !important;
          }

          .ql-editor ul li {
            list-style-type: disc !important;
          }

          .ql-editor .ql-indent-1 {
            padding-left: 3em !important;
          }
        `
      }} />
    </div>
  )
}

export default MainContent