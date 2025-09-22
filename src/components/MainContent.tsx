import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
// import { Chart } from '@antv/g2' // Remove G2 Chart import
import OpenAI from 'openai' // Import OpenAI
import ChartBlot from '../utils/ChartBlot' // Import ChartBlot
import 'quill/dist/quill.snow.css' // Import Quill styles

interface MainContentProps {
  quillInstance: React.MutableRefObject<Quill | null>
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // This is the default and can be omitted
  dangerouslyAllowBrowser: true, // Allow usage in browser environment
})

const MainContent: React.FC<MainContentProps> = ({ quillInstance }) => {
  const quillRef = useRef(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)

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
          { insert: '欢迎使用图文图表制作工具', attributes: { header: 1 } },
          { insert: '\n' },
          { insert: '这是一个功能演示文档', attributes: { header: 2 } },
          { insert: '\n' },
          { insert: '小标题示例', attributes: { header: 3 } },
          { insert: '\n' },
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
          { insert: '第一项内容', attributes: { list: 'ordered' } },
          { insert: '\n' },
          { insert: '第二项内容', attributes: { list: 'ordered' } },
          { insert: '\n' },
          { insert: '第三项内容', attributes: { list: 'ordered' } },
          { insert: '\n' },
          { insert: '无序列表示例：' },
          { insert: '\n' },
          { insert: '项目一', attributes: { list: 'bullet' } },
          { insert: '\n' },
          { insert: '项目二', attributes: { list: 'bullet' } },
          { insert: '\n' },
          { insert: '项目三', attributes: { list: 'bullet' } },
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

  const handleGenerateChart = async () => {
    if (!quillInstance.current) return

    const userPrompt = "generate monthly sales data for 2023 for a bar chart."

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates G2 chart data in JSON format based on user prompts. Provide an array of objects, each with 'category' and 'value' fields, and a chart type (line or interval). Ensure the output is valid JSON and directly usable by G2. Do not include any explanation, just the JSON object containing data and type."
          },
          {
            role: "user",
            content: `Generate G2 chart data for the following request: ${userPrompt}. Example format: { \"data\": [{ \"category\": \"Jan\", \"value\": 10 }, { \"category\": \"Feb\", \"value\": 20 }], \"type\": \"interval\", \"xField\": \"category\", \"yField\": \"value\" }`
          }
        ],
        response_format: { type: "json_object" },
      })

      const chartDataContent = response.choices[0]?.message?.content

      if (chartDataContent) {
        try {
          const chartConfig = JSON.parse(chartDataContent)
          const range = quillInstance.current.getSelection(true);
          quillInstance.current.insertEmbed(range.index, 'chart', chartConfig, Quill.sources.USER);
          quillInstance.current.setSelection(range.index + 1, Quill.sources.SILENT);
        } catch (error) {
          console.error("Failed to parse OpenAI response as chart config:", error)
        }
      }
    } catch (error) {
      console.error("OpenAI API call failed:", error)
    }
    setShowToolbar(false)
  }

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
            className="absolute right-12 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-20 flex flex-col space-y-3 w-44"
            style={{
              top: `${currentLine * 30 + 5}px` // 跟随当前行位置
            }}
          >
            <button
              onClick={() => handleFormatClick('header', 1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left text-xl font-bold"
            >
              标题 1
            </button>
            <button
              onClick={() => handleFormatClick('header', 2)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left text-lg font-bold"
            >
              标题 2
            </button>
            <button
              onClick={() => handleFormatClick('header', 3)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left text-base font-bold"
            >
              标题 3
            </button>
            <button
              onClick={() => handleFormatClick('bold')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left font-bold"
            >
              粗体
            </button>
            <button
              onClick={() => handleFormatClick('italic')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left italic"
            >
              斜体
            </button>
            <button
              onClick={() => handleFormatClick('list', 'ordered')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left"
            >
              有序列表
            </button>
            <button
              onClick={() => handleFormatClick('list', 'bullet')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left"
            >
              无序列表
            </button>
            <button
              onClick={handleGenerateChart}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-left"
            >
              插入图表
            </button>
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
        <div className="relative z-10 h-full">
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