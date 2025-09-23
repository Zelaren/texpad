import { create } from 'zustand'
import type { LineInfo } from '../hooks/useLineAlignment'

interface EditorState {
  toolbarVisible: boolean
  setToolbarVisible: (visible: boolean) => void
  currentLine: number
  setCurrentLine: (line: number) => void
  currentLineInfo: LineInfo | null
  setCurrentLineInfo: (info: LineInfo | null) => void
  documentTitle: string
  setDocumentTitle: (title: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  toolbarVisible: false,
  setToolbarVisible: (visible) => set({ toolbarVisible: visible }),
  currentLine: 0,
  setCurrentLine: (line) => set({ currentLine: line }),
  currentLineInfo: null,
  setCurrentLineInfo: (info) => set({ currentLineInfo: info }),
  documentTitle: '图文图表制作工具',
  setDocumentTitle: (title) => set({ documentTitle: title }),
}))
