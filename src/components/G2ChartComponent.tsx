import React, { useEffect, useRef } from 'react'
import { Chart } from '@antv/g2'
import type { ChartData, ChartDatum } from '../types/chart'

interface G2ChartComponentProps extends Omit<ChartData, 'data'> {
  data: ChartDatum[]
}

const G2ChartComponent: React.FC<G2ChartComponentProps> = React.memo(({ data, type = 'line', xField = 'year', yField = 'value' }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)
  const prevConfigRef = useRef<{ type: string; xField: string; yField: string }>()

  useEffect(() => {
    if (!chartContainerRef.current) return

    const currentConfig = { type, xField, yField }
    const configChanged = !prevConfigRef.current || 
      JSON.stringify(prevConfigRef.current) !== JSON.stringify(currentConfig)

    // 如果配置发生变化，需要重新创建图表
    if (configChanged || !chartInstance.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }

      const chart = new Chart({
        container: chartContainerRef.current,
        autoFit: true,
        height: 300,
      })

      if (type === 'line') {
        chart.line().position(`${xField}*${yField}`).label(yField)
      } else if (type === 'interval') {
        chart.interval().position(`${xField}*${yField}`).label(yField)
      }

      chartInstance.current = chart
      prevConfigRef.current = currentConfig
    }

    // 只更新数据，避免重新创建图表
    if (chartInstance.current) {
      chartInstance.current.data(data)
      chartInstance.current.render()
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
        prevConfigRef.current = undefined
      }
    }
  }, [data, type, xField, yField])

  return <div ref={chartContainerRef} className="w-full" style={{ height: 300 }} />
})

export default G2ChartComponent
