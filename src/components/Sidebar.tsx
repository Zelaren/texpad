import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Plus, Settings, ChevronRight, ChevronLeft } from 'lucide-react'

interface SidebarProps {
  onCreateNewDocument: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  onCreateNewDocument,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeItem, setActiveItem] = useState('editor')
  const navigate = useNavigate()

  // 模拟历史记录数据
  const historyItems = [
    { id: 1, title: '项目计划书', date: '2024-03-20', path: '/editor/1' },
    { id: 2, title: '产品需求文档', date: '2024-03-19', path: '/editor/2' },
    { id: 3, title: '会议纪要', date: '2024-03-18', path: '/editor/3' },
    { id: 4, title: '技术方案', date: '2024-03-17', path: '/editor/4' },
    { id: 5, title: '用户手册', date: '2024-03-16', path: '/editor/5' },
  ]

  const handleHistoryItemClick = (path: string, id: number) => {
    setActiveItem(`history-${id}`)
    navigate(path)
  }

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out`}
      aria-expanded={!isCollapsed}
    >
      <div
        className={`p-4 border-b border-gray-200 flex ${
          isCollapsed ? 'flex-col items-center space-y-3' : 'items-center space-x-3'
        }`}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={onCreateNewDocument}
          className={`bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center ${
            isCollapsed ? 'w-10 h-10' : 'flex-1 px-4 py-3 space-x-2'
          }`}
        >
          <Plus className="w-5 h-5" />
          {isCollapsed ? (
            <span className="sr-only">新建文档</span>
          ) : (
            <span className="font-medium">新建文档</span>
          )}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'hidden' : 'block'} flex-shrink-0`}>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            历史记录
          </h3>
          <div className="space-y-2">
            {historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistoryItemClick(item.path, item.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeItem === `history-${item.id}`
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''} flex-shrink-0 mt-auto`}>
        <Link
          to="/settings"
          className={`rounded-lg transition-colors flex items-center ${
            isCollapsed ? 'justify-center w-10 h-10' : 'w-full space-x-3 px-4 py-3'
          } ${
            activeItem === 'settings'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveItem('settings')}
        >
          <Settings className="w-5 h-5" />
          {isCollapsed ? (
            <span className="sr-only">设置</span>
          ) : (
            <span className="font-medium">设置</span>
          )}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
