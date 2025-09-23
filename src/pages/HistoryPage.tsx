import { Link } from 'react-router-dom'
import { FileText, Search, Edit, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const HistoryPage: React.FC = () => {
  // 模拟历史记录数据
  const historyItems = [
    {
      id: 1,
      title: '项目计划书',
      date: '2024-03-20',
      lastModified: '2024-03-20 14:30',
      size: '2.3 MB',
      path: '/editor/1'
    },
    {
      id: 2,
      title: '产品需求文档',
      date: '2024-03-19',
      lastModified: '2024-03-19 16:45',
      size: '1.8 MB',
      path: '/editor/2'
    },
    {
      id: 3,
      title: '会议纪要',
      date: '2024-03-18',
      lastModified: '2024-03-18 10:20',
      size: '856 KB',
      path: '/editor/3'
    },
    {
      id: 4,
      title: '技术方案',
      date: '2024-03-17',
      lastModified: '2024-03-17 09:15',
      size: '3.1 MB',
      path: '/editor/4'
    },
    {
      id: 5,
      title: '用户手册',
      date: '2024-03-16',
      lastModified: '2024-03-16 11:30',
      size: '1.2 MB',
      path: '/editor/5'
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">历史记录</h1>
              <p className="text-sm text-gray-600 mt-1">查看和管理您的文档历史</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文档..."
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>按日期排序</option>
                <option>按名称排序</option>
                <option>按大小排序</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{historyItems.length}</div>
              <div className="text-sm text-blue-800">总文档数</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">9.3 MB</div>
              <div className="text-sm text-green-800">总大小</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-purple-800">本周编辑</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-orange-800">今日编辑</div>
            </div>
          </div>

          {/* 文档列表 */}
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">创建于 {item.date}</span>
                      <span className="text-xs text-gray-500">最后编辑 {item.lastModified}</span>
                      <span className="text-xs text-gray-500">{item.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={item.path}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Link>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-1" />
                    导出
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              显示 1-{historyItems.length} 条，共 {historyItems.length} 条记录
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一页
              </button>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                下一页
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage