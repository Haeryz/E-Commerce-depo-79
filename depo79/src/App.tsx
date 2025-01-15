import { Box } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/main/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import Cart from './pages/client/Cart'
import Chat from './pages/client/Chat'
import Checkout from './pages/client/Checkout'
import ListBarang from './pages/client/ListBarang'
import Payment from './pages/client/Payment'
import StatusPengiriman from './pages/client/StatusPengiriman'
import Ulasan from './pages/client/Ulasan'
import Profile from './pages/client/Profile'
import { useColorModeValue } from './components/ui/color-mode'
import Navbar2 from './components/main/Navbar2'

function App() {
  // Dynamically set the background color based on the color mode
  const bgColor = useColorModeValue('gray.100', 'gray.900')
  const textColor = useColorModeValue('black', 'white') // Adjust text color for visibility

  return (
    <Box bg={bgColor} color={textColor} minHeight="100vh">
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/list-barang" element={<ListBarang />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/status-pengiriman" element={<StatusPengiriman />} />
        <Route path="/ulasan" element={<Ulasan />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Box>
  )
}

export default App
