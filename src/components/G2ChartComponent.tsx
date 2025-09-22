import React, { useEffect, useRef } from 'react'
import { Chart } from '@antv/g2'

interface G2ChartComponentProps {
  data: any[]; // Expecting data for G2 chart
  type?: 'line' | 'interval'; // Chart type, default to line
  xField?: string;
  yField?: string;
}

const G2ChartComponent: React.FC<G2ChartComponentProps> = ({ data, type = 'line', xField = 'year', yField = 'value' }) => {
  const chartContainerRef = useRef(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartContainerRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }

      const chart = new Chart({
        container: chartContainerRef.current,
        autoFit: true,
        height: 300,
      })

      chart.data(data)

      if (type === 'line') {
        chart.line().position(`${xField}*${yField}`).label(yField)
      } else if (type === 'interval') {
        chart.interval().position(`${xField}*${yField}`).label(yField)
      }

      chart.render()
      chartInstance.current = chart
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [data, type, xField, yField])

  return <div ref={chartContainerRef} className="w-full h-full" />
}

export default G2ChartComponent
