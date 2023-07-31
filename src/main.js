import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'

// 渲染你的 React 组件
const root = createRoot(document.getElementById('app'))
root.render(
  <Router>
    <App />
  </Router>
)