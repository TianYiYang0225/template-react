import React from 'react'
import ReactDom from 'react-dom'
import './index.less'
import App from '@src/App'
import ErrorBoundary from '@src/container/ErrorBoundary'

const Main = () => (
  // 严格模式
  <React.StrictMode>
    {/* 边界异常监控 */}
    <ErrorBoundary>
      {/* 内容 */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

ReactDom.render(<Main />, document.getElementById('root'))
