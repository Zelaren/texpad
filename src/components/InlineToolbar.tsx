import React from 'react'

interface InlineToolbarProps {
  topPx: number
  visible: boolean
  onFormat: (format: 'normal' | 'header' | 'bold' | 'italic' | 'list', value?: any) => void
  onUploadImage: () => void
  onInsertChart: () => void
  bindFileInput: (el: HTMLInputElement | null) => void
  onImageChange: React.ChangeEventHandler<HTMLInputElement>
}

const InlineToolbar: React.FC<InlineToolbarProps> = ({ topPx, visible, onFormat, onUploadImage, onInsertChart, bindFileInput, onImageChange }) => {
  if (!visible) return null
  return (
    <div
      className="absolute right-12 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-20 flex flex-col space-y-4 w-60"
      style={{ top: `${topPx}px` }}
    >
      <div className="grid grid-cols-7 gap-2">
        <button onClick={() => onFormat('normal')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">T</button>
        <button onClick={() => onFormat('header', 1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H1</button>
        <button onClick={() => onFormat('header', 2)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H2</button>
        <button onClick={() => onFormat('header', 3)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H3</button>
        <button onClick={() => onFormat('normal')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">H4</button>
        <button onClick={() => onFormat('list', 'ordered')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">有序</button>
        <button onClick={() => onFormat('list', 'bullet')} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center">无序</button>
      </div>

      <div className="flex items-center">
        <button onClick={onUploadImage} className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-center">上传图片</button>
        <input ref={bindFileInput} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
      </div>

      <div className="grid grid-cols-2 gap-2 items-center">
        <button onClick={onInsertChart} className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-center">插入示例图表</button>
        <button disabled className="px-3 py-2 bg-gray-100 text-gray-400 rounded text-center cursor-not-allowed">AI 生成（暂未实现）</button>
      </div>
    </div>
  )
}

export default InlineToolbar


