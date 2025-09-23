// Quill类型声明文件
import Quill from 'quill'

declare module 'quill' {
  interface QuillConstructor {
    import(path: string): any
  }

  namespace Quill {
    interface BlotConstructor {
      new (...args: any[]): Blot
      blotName: string
      className: string
      tagName: string
      create(value?: any): HTMLElement
      value(domNode: HTMLElement): any
    }

    interface Blot {
      domNode: HTMLElement
      prev: Blot | null
      next: Blot | null
      parent: Blot | null
      scroll: Blot
      length(): number
      offset(root?: Blot): number
      index(blot: Blot, offset: number): number
      position(index: number, inclusive?: boolean): [Blot, number]
      value(): any
      clone(): Blot
      wrap(name: string, value?: any): Blot
      unwrap(): void
      replaceWith(name: string, value?: any): Blot
      replaceWith(replacement: Blot): Blot
      isolate(index: number, length: number): Blot
      split(index: number, force?: boolean): Blot
      remove(): void
      detach(): void
      attach(): void
      insertAt(index: number, text: string, def?: any): void
      insertAt(index: number, embed: string, value: any): void
      deleteAt(index: number, length: number): void
      formatAt(index: number, length: number, name: string, value: any): void
      insertInto(parent: Blot, ref?: Blot): void
      moveChildren(target: Blot, ref?: Blot): void
      optimize(context: { [key: string]: any }): void
      update(mutations: MutationRecord[], context: { [key: string]: any }): void
    }

    interface BlockEmbed extends Blot {
      contentNode: HTMLElement
    }
  }

  const BlockEmbed: {
    new (...args: any[]): Quill.BlockEmbed
    blotName: string
    className: string
    tagName: string
    create(value?: any): HTMLElement
    value(domNode: HTMLElement): any
  }
}

export { BlockEmbed }