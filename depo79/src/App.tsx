import { Box } from '@chakra-ui/react'
import Navbar from './components/main/Navbar'
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

function App() {
  return (
  <Box>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/chekcout" element={<Checkout/>}/>
      <Route path="/list-barang" element={<ListBarang/>}/>
      <Route path="/payment" element={<Payment/>}/>
      <Route path="/status-pengiriman" element={<StatusPengiriman/>}/>
      <Route path="/ulasan" element={<Ulasan/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    <Footer/>
  </Box>
  )
}

export default App
