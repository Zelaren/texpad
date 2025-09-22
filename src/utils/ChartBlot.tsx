/** @jsxImportSource react */
import React from 'react'
import ReactDOM from 'react-dom/client'
import Quill from 'quill'
const BlockEmbed = Quill.import('blots/block/embed')

interface ChartData {
  data: any[];
  type?: 'line' | 'interval';
  xField?: string;
  yField?: string;
}

// We need to dynamically import G2ChartComponent to avoid circular dependencies
// and ensure it's loaded only when needed.
let G2ChartComponent: React.ComponentType<ChartData>

const importG2ChartComponent = async () => {
  if (!G2ChartComponent) {
    const module = await import('../components/G2ChartComponent')
    G2ChartComponent = module.default
  }
}

class ChartBlot extends BlockEmbed {
  static blotName = 'chart';
  static className = 'quill-chart-embed';
  static tagName = 'div';

  static create(value: ChartData) {
    const node = super.create() as HTMLElement;
    node.setAttribute('data-chart', JSON.stringify(value));
    importG2ChartComponent().then(() => {
      if (G2ChartComponent) {
        const root = ReactDOM.createRoot(node);
        root.render(<G2ChartComponent {...value} />);
      }
    })
    return node;
  }

  static value(node: HTMLElement): ChartData {
    const chartData = node.getAttribute('data-chart');
    return chartData ? JSON.parse(chartData) : { data: [] };
  }

  // Optional: Add a method to remove the React root when the blot is removed from Quill
  // This can prevent memory leaks.
  // unmount() {
  //   const root = ReactDOM.createRoot(this.domNode);
  //   root.unmount();
  // }
}

export default ChartBlot
