import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Quill from 'quill'
import MainContent from '../components/MainContent'
import { Download, Edit } from 'lucide-react'

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const quillInstance = useRef<Quill | null>(null)
  const [documentTitle, setDocumentTitle] = useState<string>(
    id ? `文档 ${id}` : '未命名文档'
  )
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)

  
  const handleExport = () => {
    if (!quillInstance.current) return

    const html = quillInstance.current.root.innerHTML
    const element = document.createElement('a')
    const file = new Blob([html], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${documentTitle}-${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (documentTitle.trim() === '') {
      setDocumentTitle('未命名文档')
    }
  }

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex-1"></div>

        {/* 文档标题 - 居中 */}
        <div className="flex-1 max-w-md">
          {isEditingTitle ? (
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              className="w-full px-3 py-2 text-lg font-semibold text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors text-center"
              onClick={() => setIsEditingTitle(true)}
              title="点击编辑标题"
            >
              {documentTitle}
              <Edit className="w-4 h-4 inline-block ml-2 text-gray-400" />
            </h1>
          )}
        </div>

        {/* 导出按钮 - 右侧 */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>导出</span>
          </button>
        </div>
      </header>

      {/* 主要编辑区域 */}
      <div className="flex-1 flex bg-gray-100">
        <MainContent quillInstance={quillInstance} />
      </div>
    </div>
  )
}

export default EditorPage
