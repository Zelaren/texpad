import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout: React.FC = () => {
  const handleNewDocument = () => {
    // 创建新文档的逻辑
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onCreateNewDocument={handleNewDocument} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout