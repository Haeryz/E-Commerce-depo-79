import { Box } from '@chakra-ui/react';
import { Routes, Route, Outlet } from 'react-router-dom';
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
import DetailBarang from './pages/client/DetailBarang';
import { Toaster } from './components/ui/toaster';
import OtpForm from './pages/client/OtpForm';
import AdminLayout from './pages/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrder from './pages/admin/AdminOrder';
import AdminReview from './pages/admin/AdminReview';
import AdminChat from './pages/admin/AdminChat';
import AdminData from './pages/admin/AdminData';
import AdminHistory from './pages/admin/AdminHistory';
import AdminRoute from './pages/AdminRoute';

function App() {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Box bg={bgColor} color={textColor} minHeight="100vh">
      <Toaster />
      <Routes>
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout><Outlet /></AdminLayout>
          </AdminRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="review" element={<AdminReview />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="data" element={<AdminData />} />
          <Route path="history" element={<AdminHistory />} />
        </Route>

        {/* Client Routes */}
        <Route
          path="/*"
          element={
            <>
              <Navbar2 />
              <Routes>
                {/* unprotected route */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search" element={<ListBarang />} />
                <Route path="/detail-barang/:id" element={<DetailBarang />} />
                <Route path='/verify-otp' element={<OtpForm />} />

                {/* Protected Route user harus login */}
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={Profile} />}
                >
                  <Route path="profile-sidebar" element={<SidebarProfile />} />
                  <Route path="alamat-sidebar" element={<SidebarAlamat />} />
                </Route>

                <Route path='/cart' element={<ProtectedRoute element={Cart} />} />
                <Route path='/checkout' element={<ProtectedRoute element={Checkout} />} />
                <Route path='/chat' element={<ProtectedRoute element={Chat} />} />
                <Route path='/payment' element={<ProtectedRoute element={Payment} />} />
                <Route path='/status-pengiriman' element={<ProtectedRoute element={StatusPengiriman} />} />
                <Route path='/ulasan' element={<ProtectedRoute element={Ulasan} />} />

                {/* Test route untuk testing component */}
                <Route path="/test" element={<Test />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
