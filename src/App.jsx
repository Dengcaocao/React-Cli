import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home/home'
import About from './pages/about/about'

const App = () => {
  return (
    <>
      <h1>App</h1>
      <ul>
        <li>
          <Link to='/home'>首页</Link>
        </li>
        <li>
        <Link to='/about'>关于</Link>
        </li>
      </ul>

      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </>
  )
}

export default App
