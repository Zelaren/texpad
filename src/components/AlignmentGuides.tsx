import React from 'react'

interface AlignmentGuidesProps {
  lineHeightPx?: number
  totalLines?: number
}

const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({ lineHeightPx = 30, totalLines = 100 }) => {
  const lines: React.ReactNode[] = []
  for (let i = 0; i < totalLines; i++) {
    lines.push(
      <div
        key={i}
        className="absolute left-0 right-0 border-b border-blue-100"
        style={{ top: `${i * lineHeightPx}px`, height: `${lineHeightPx}px` }}
      />
    )
  }
  return <div className="absolute inset-0 pointer-events-none">{lines}</div>
}

export default AlignmentGuides


