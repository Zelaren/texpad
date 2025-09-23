import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Plus, Settings, ChevronRight } from 'lucide-react'

interface SidebarProps {
  onCreateNewDocument: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateNewDocument }) => {
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

  const handleHistoryItemClick = (path: string) => {
    setActiveItem('history')
    navigate(path)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 顶部新建文档按钮 */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateNewDocument}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">新建文档</span>
        </button>
      </div>

      {/* 历史记录列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            历史记录
          </h3>
          <div className="space-y-2">
            {historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistoryItemClick(item.path)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeItem === `history-${item.id}`
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
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

      {/* 底部设置按钮 */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeItem === 'settings'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => setActiveItem('settings')}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">设置</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar