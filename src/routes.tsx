import { Route, Routes } from 'react-router'
import Home from './pages/HomePage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
