import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import EditorPage from '../pages/EditorPage'
import SettingsPage from '../pages/SettingsPage'
import HistoryPage from '../pages/HistoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <EditorPage />,
      },
      {
        path: 'editor/:id',
        element: <EditorPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
])

export default router
