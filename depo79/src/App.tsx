import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/main/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/client/Cart';
import Chat from './pages/client/Chat';
import Checkout from './pages/client/Checkout';
import ListBarang from './pages/client/ListBarang';
import Payment from './pages/client/Payment';
import StatusPengiriman from './pages/client/StatusPengiriman';
import Ulasan from './pages/client/Ulasan';
import Profile from './pages/client/Profile';
import { useColorModeValue } from './components/ui/color-mode';
import Navbar2 from './components/main/Navbar2';
import Test from './pages/test';
import SidebarProfile from './pages/client/profilesidebar/SidebarProfile';
import SidebarAlamat from './pages/client/profilesidebar/SidebarAlamat';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'white');

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
        <Route
          path="/profile"
          element={
            <ProtectedRoute element={<Profile />}>
              <Route index element={<SidebarProfile />} />
              <Route path="profile-sidebar" element={<SidebarProfile />} />
              <Route path="alamat-sidebar" element={<SidebarAlamat />} />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
