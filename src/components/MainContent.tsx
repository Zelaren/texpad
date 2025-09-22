import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
// import { Chart } from '@antv/g2' // Remove G2 Chart import
import OpenAI from 'openai' // Import OpenAI
import ChartBlot from '../utils/ChartBlot' // Import ChartBlot

interface MainContentProps {
  quillInstance: React.MutableRefObject<Quill | null>
}

// Initialize OpenAI instance (moved from App.tsx)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

const MainContent: React.FC<MainContentProps> = ({ quillInstance }) => {
  const quillRef = useRef(null)
  // const chartRef = useRef(null) // Remove chartRef
  // const chartInstance = useRef<Chart | null>(null) // Remove chartInstance

  useEffect(() => {
    if (!quillInstance.current) {
      // Register custom blot before initializing Quill
      Quill.register({
        'formats/chart': ChartBlot
      })

      if (quillRef.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder: 'Compose an epic story...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }
        })
      }
    }
  }, [quillInstance])

  // Remove G2 useEffect hook
  // useEffect(() => {
  //   if (chartRef.current && !chartInstance.current) {
  //     const chart = new Chart({
  //       container: chartRef.current,
  //       autoFit: true,
  //       height: 300,
  //     })
  //
  //     chart.data([
  //       { year: '1991', value: 3 },
  //       { year: '1992', value: 4 },
  //       { year: '1993', value: 3.5 },
  //       { year: '1994', value: 5 },
  //       { year: '1995', value: 4.9 },
  //       { year: '1996', value: 6 },
  //       { year: '1997', value: 7 },
  //       { year: '1998', value: 9 },
  //       { year: '1999', value: 13 },
  //     ])
  //
  //     chart.line().position('year*value').label('value')
  //     chart.render()
  //     chartInstance.current = chart
  //   }
  // }, [])

  const handleGenerateChart = async () => {
    if (!quillInstance.current) return

    // For demonstration, use a simple prompt. In a real scenario, this would be dynamic.
    const userPrompt = "generate monthly sales data for 2023 for a bar chart."

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates G2 chart data in JSON format based on user prompts. Provide an array of objects, each with 'category' and 'value' fields, and a chart type (line or interval). Ensure the output is valid JSON and directly usable by G2. Do not include any explanation, just the JSON object containing data and type."
          },
          {
            role: "user",
            content: `Generate G2 chart data for the following request: ${userPrompt}. Example format: { \"data\": [{ \"category\": \"Jan\", \"value\": 10 }, { \"category\": \"Feb\", \"value\": 20 }], \"type\": \"interval\", \"xField\": \"category\", \"yField\": \"value\" }`
          }
        ],
        response_format: { type: "json_object" },
      })

      const chartDataContent = response.choices[0]?.message?.content

      if (chartDataContent) {
        try {
          const chartConfig = JSON.parse(chartDataContent)
          const range = quillInstance.current.getSelection(true);
          quillInstance.current.insertEmbed(range.index, 'chart', chartConfig, Quill.sources.USER);
          quillInstance.current.setSelection(range.index + 1, Quill.sources.SILENT);
        } catch (error) {
          console.error("Failed to parse OpenAI response as chart config:", error)
        }
      }
    } catch (error) {
      console.error("OpenAI API call failed:", error)
    }
  }

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-gray-850 p-6 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center">Interactive Document Editor</h1>
      <button
        onClick={handleGenerateChart}
        className="mb-4 self-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
      >
        Generate Chart (AI)
      </button>
      <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-auto">
        {/* Quill Editor */}
        <div className="w-full h-96 mb-6">
          <div ref={quillRef} className="w-full h-full border-0"></div>
        </div>

        {/* Removed AntV G2 Chart Placeholder */}
      </div>
    </main>
  )
}

export default MainContent
