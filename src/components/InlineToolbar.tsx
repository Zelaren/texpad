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

  // 面板在工具按钮下方显示，确保完全不会遮盖按钮
  const buttonHeight = 24 // 工具按钮高度
  const buttonWidth = 24 // 工具按钮宽度
  const panelMargin = 12 // 面板与按钮之间的间距
  const panelTop = topPx + buttonHeight + panelMargin + 64

  // 按钮位置：在左侧边距区域内，right-2 (8px from right)
  const leftPadding = 256 // 左侧边距宽度 (w-64)
  const buttonRightOffset = 8 // 按钮距离右侧边界的距离
  const buttonLeftPosition = leftPadding - buttonRightOffset - buttonWidth // 按钮左边界位置

  // 调整面板位置：让面板从按钮右侧开始显示，避免遮盖按钮
  const panelLeft = buttonLeftPosition + buttonWidth + 8 // 按钮右侧 + 8px间距

  return (
    <>
      {/* 指向按钮的小三角 - 指向按钮右下角 */}
      <div
        className="fixed w-0 h-0 z-30"
        style={{
          top: `${panelTop - 8}px`,
          left: `${panelLeft - 12}px`, // 面板左边缘往内12px
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '8px solid white'
        }}
      />

      {/* 主面板 - 在工具按钮右下方，确保不遮盖按钮 */}
      <div
        className="fixed w-64 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-lg p-3 z-30"
        style={{
          top: `${panelTop}px`,
          left: `${panelLeft}px`
        }}
      >
        {/* 第一行：基本格式 */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-2 font-medium">基本格式</div>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => onFormat('normal')}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              title="正文"
            >
              正文
            </button>
            <button
              onClick={() => onFormat('header', 1)}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors font-bold"
              title="一级标题"
            >
              H1
            </button>
            <button
              onClick={() => onFormat('header', 2)}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold"
              title="二级标题"
            >
              H2
            </button>
            <button
              onClick={() => onFormat('header', 3)}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors font-medium"
              title="三级标题"
            >
              H3
            </button>
            <button
              onClick={() => onFormat('header', 4)}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              title="四级标题"
            >
              H4
            </button>
            <button
              onClick={() => onFormat('bold')}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors font-bold"
              title="加粗"
            >
              B
            </button>
            <button
              onClick={() => onFormat('italic')}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors italic"
              title="斜体"
            >
              I
            </button>
            <button
              onClick={() => onFormat('list', 'ordered')}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              title="有序列表"
            >
              1.
            </button>
            <button
              onClick={() => onFormat('list', 'bullet')}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              title="无序列表"
            >
              •
            </button>
          </div>
        </div>

        {/* 第二行：插入图片 */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-2 font-medium">插入图片</div>
          <div className="flex gap-2">
            <button
              onClick={onUploadImage}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              title="上传本地图片"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              上传图片
            </button>
            <button
              disabled
              className="px-3 py-2.5 text-sm rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
              title="从网络添加图片（即将推出）"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              URL
            </button>
          </div>
          <input ref={bindFileInput} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
        </div>

        {/* 第三行：插入图表 */}
        <div>
          <div className="text-xs text-gray-500 mb-2 font-medium">插入图表</div>
          <div className="flex gap-2">
            <button
              onMouseDown={(event) => {
                event.preventDefault()
                onInsertChart()
              }}
              className="flex-1 px-3 py-2.5 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              title="插入柱状图"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              插入图表
            </button>
            <button
              disabled
              className="px-3 py-2.5 text-sm rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
              title="AI 生成图表（即将推出）"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              AI
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default InlineToolbar