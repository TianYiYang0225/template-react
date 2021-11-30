import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ROUTE_LIST from '@src/router'

const App = () => {
  return (
    <Router>
      <Routes>
        {ROUTE_LIST.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          ></Route>
        ))}
      </Routes>
    </Router>
  )
}

export default App
