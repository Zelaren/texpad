import { useRef } from 'react'
import Quill from 'quill'
import MainContent from './components/MainContent'


function App() {
  const quillInstance = useRef<Quill | null>(null)

  const handleNewDocument = () => {
    if (quillInstance.current) {
      quillInstance.current.setContents([])
    }
  }

  const handleExport = () => {
    if (quillInstance.current) {
      const html = quillInstance.current.root.innerHTML

      // 创建下载链接
      const element = document.createElement('a')
      const file = new Blob([html], { type: 'text/html' })
      element.href = URL.createObjectURL(file)
      element.download = `document-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={handleNewDocument}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>新建文档</span>
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800">图文图表制作工具</h1>
        
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出</span>
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 flex bg-gray-100">
        <MainContent quillInstance={quillInstance} />
      </div>
    </div>
  )
}

export default App
