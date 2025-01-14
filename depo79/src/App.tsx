import { useState } from 'react'
import { Box, Button, HStack } from '@chakra-ui/react'
import Navbar from './components/main/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/main/Footer'

function App() {
  return (
  <Box>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <Footer/>
  </Box>
  )
}

export default App
