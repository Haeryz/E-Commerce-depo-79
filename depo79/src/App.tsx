import { Box } from '@chakra-ui/react'
import Navbar from './components/main/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/main/Footer'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
  return (
  <Box>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    <Footer/>
  </Box>
  )
}

export default App
