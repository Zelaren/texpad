import React from 'react'

type FormatValue = 1 | 2 | 3 | 4 | 'ordered' | 'bullet' | false

interface InlineToolbarProps {
  topPx: number
  visible: boolean
  onFormat: (format: 'normal' | 'header' | 'bold' | 'italic' | 'list', value?: FormatValue) => void
  onUploadImage: () => void
  onInsertChart: () => void
  bindFileInput: (el: HTMLInputElement | null) => void
  onImageChange: React.ChangeEventHandler<HTMLInputElement>
}

const InlineToolbar: React.FC<InlineToolbarProps> = ({
  topPx,
  visible,
  onFormat,
  onUploadImage,
  onInsertChart,
  bindFileInput,
  onImageChange,
}) => {
  if (!visible) return null
  return (
    <div
      className="absolute right-12 w-52 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-lg p-4 z-20 flex flex-col gap-4"
      style={{ top: `${topPx}px` }}
    >
      <div className="grid grid-cols-4 gap-2 text-sm">
        <button onClick={() => onFormat('normal')} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">正文</button>
        <button onClick={() => onFormat('header', 1)} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">H1</button>
        <button onClick={() => onFormat('header', 2)} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">H2</button>
        <button onClick={() => onFormat('header', 3)} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">H3</button>
        <button onClick={() => onFormat('header', 4)} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">H4</button>
        <button onClick={() => onFormat('bold')} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">加粗</button>
        <button onClick={() => onFormat('italic')} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">斜体</button>
        <button onClick={() => onFormat('list', 'ordered')} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">有序</button>
        <button onClick={() => onFormat('list', 'bullet')} className="px-2 py-1 rounded-md border border-transparent bg-gray-100 hover:bg-gray-200">无序</button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onUploadImage} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-sm transition-colors">上传图片</button>
        <input ref={bindFileInput} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
      </div>

      <div className="grid grid-cols-2 gap-2 items-center text-sm">
        <button
          onMouseDown={(event) => {
            event.preventDefault()
            onInsertChart()
          }}
          className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          插入图表
        </button>
        <button disabled className="px-3 py-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed">
          AI 生成
        </button>
      </div>
    </div>
  )
}

export default InlineToolbar

