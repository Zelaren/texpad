import { useEffect, useRef } from 'react'
import Quill from 'quill'

export interface UseQuillEditorOptions {
  placeholder?: string
  beforeCreate?: () => void
}

export function useQuillEditor(externalRef: React.MutableRefObject<Quill | null>, options?: UseQuillEditorOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!externalRef.current && containerRef.current) {
      if (options?.beforeCreate) {
        options.beforeCreate()
      }
      externalRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: options?.placeholder ?? '开始书写...',
        modules: { toolbar: false },
      })
    }
  }, [externalRef, options?.placeholder, options?.beforeCreate])

  return { containerRef }
}


