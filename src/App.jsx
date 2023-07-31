import React, { Suspense, lazy } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Home = lazy(() => import('./pages/home/home'))
const About = lazy(() => import('./pages/about/about'))

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

      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
