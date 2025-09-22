import { useRef } from 'react'
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Quill from 'quill'
// import { Chart } from '@antv/g2'
// import OpenAI from 'openai'

// import LeftSidebar from './components/LeftSidebar'
import MainContent from './components/MainContent'
// import RightSidebar from './components/RightSidebar'

// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // This is the default and can be omitted
//   dangerouslyAllowBrowser: true, // Allow usage in browser environment
// })

function App() {
  const quillInstance = useRef<Quill | null>(null)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Main Content Area */}
      <MainContent quillInstance={quillInstance} />
    </div>
  )
}

export default App
