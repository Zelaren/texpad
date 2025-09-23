import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    theme: 'light',
    fontSize: 14,
    lineHeight: 1.6,
    showLineNumbers: false,
    wordWrap: true,
    openaiBaseUrl: '',
    openaiApiKey: '',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  })

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">设置</h1>
          <p className="text-sm text-gray-600 mt-1">自定义您的编辑器体验</p>
        </div>

        <div className="p-6 space-y-6">
          {/* 自动保存设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">自动保存</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">启用自动保存</label>
                  <p className="text-sm text-gray-500">自动保存您的文档更改</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.autoSave && (
                <div className="ml-4">
                  <label className="text-sm font-medium text-gray-700">保存间隔</label>
                  <select
                    value={settings.autoSaveInterval}
                    onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                    className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={10}>10 秒</option>
                    <option value={30}>30 秒</option>
                    <option value={60}>1 分钟</option>
                    <option value={300}>5 分钟</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 编辑器设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">编辑器</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">字体大小</label>
                <input
                  type="number"
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  min="12"
                  max="24"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">行高</label>
                <input
                  type="number"
                  value={settings.lineHeight}
                  onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">显示行号</label>
                  <p className="text-sm text-gray-500">在编辑器中显示行号</p>
                </div>
                <button
                  onClick={() => handleSettingChange('showLineNumbers', !settings.showLineNumbers)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showLineNumbers ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">自动换行</label>
                  <p className="text-sm text-gray-500">长文本自动换行显示</p>
                </div>
                <button
                  onClick={() => handleSettingChange('wordWrap', !settings.wordWrap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.wordWrap ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.wordWrap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 主题设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">主题</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: '浅色主题', bg: 'bg-white', border: 'border-gray-300' },
                { value: 'dark', label: '深色主题', bg: 'bg-gray-800', border: 'border-gray-600' },
                { value: 'auto', label: '自动', bg: 'bg-gradient-to-r from-white to-gray-800', border: 'border-gray-400' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    settings.theme === theme.value
                      ? 'border-blue-500 bg-blue-50'
                      : `border-gray-200 hover:border-gray-300 ${theme.bg}`
                  }`}
                >
                  <div className={`w-full h-16 rounded ${theme.bg} mb-2`}></div>
                  <span className="text-sm font-medium text-gray-700">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* OpenAI 配置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">OpenAI 配置</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">API Base URL</label>
                <input
                  type="url"
                  value={settings.openaiBaseUrl}
                  onChange={(e) => handleSettingChange('openaiBaseUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">自定义 OpenAI API 基础URL</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                  placeholder="sk-..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">您的 OpenAI API 密钥</p>
              </div>
            </div>
          </div>

          {/* 字体设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">字体设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">基础字体</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="system-ui, -apple-system, sans-serif">系统默认</option>
                  <option value='"Segoe UI", Roboto, sans-serif'>Segoe UI</option>
                  <option value='"Helvetica Neue", Arial, sans-serif'>Helvetica</option>
                  <option value='"Times New Roman", serif'>Times New Roman</option>
                  <option value='Georgia, serif'>Georgia</option>
                  <option value='"Courier New", monospace'>Courier New</option>
                  <option value='"Microsoft YaHei", sans-serif'>微软雅黑</option>
                  <option value='"PingFang SC", sans-serif'>苹方</option>
                  <option value='"Noto Sans SC", sans-serif'>思源黑体</option>
                </select>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重置默认</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>保存设置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage