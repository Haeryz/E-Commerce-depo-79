import { Box, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import Logo from '../../assets/LogoCompany.png'
import { FaBoxArchive } from "react-icons/fa6"
import { FaHistory, FaHome, FaStar } from "react-icons/fa"
import { IoReceipt, IoChatbubbles } from "react-icons/io5"
import { BsGraphUp } from "react-icons/bs"
import { IconType } from 'react-icons'
import { LogOutIcon } from 'lucide-react'
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode } from '../ui/color-mode'
import { useAuthStore } from '../../store/auth'

const navItems: Array<{ icon: IconType, text: string, path: string }> = [
  { icon: FaHome, text: 'Home', path: '/admin' },
  { icon: FaBoxArchive, text: 'Produk', path: '/admin/product' },
  { icon: IoReceipt, text: 'Pesanan', path: '/admin/order' },
  { icon: IoChatbubbles, text: 'Pesan', path: '/admin/chat' },
  { icon: FaHistory, text: 'Riwayat Pembelian', path: '/admin/history' },
  { icon: BsGraphUp, text: 'Data', path: '/admin/data' },
  { icon: FaStar, text: 'Review', path: '/admin/review' },
]

const NavItem = ({ icon: IconComponent, text, path }: { icon: IconType, text: string, path: string }) => {
  const navigate = useNavigate();
  
  return (
    <HStack 
      gap={3} 
      width="full" 
      cursor="pointer"
      p={2}
      borderRadius="md"
      _hover={{ bg: 'gray.200' }}
      onClick={() => navigate(path)}
    >
      <IconComponent size={20} />
      <Text>{text}</Text>
    </HStack>
  )
}

const AdminSidebar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(() => {
      navigate('/login');
    });
  };

  return (
    <Box height="100%" p={4}>
      <Box 
        height="100%" 
        maxW="200px" 
        p={4} 
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} 
        borderRadius={8} 
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack gap={5} align="stretch" height="100%" w={'100%'}>
          <Image src={Logo} alt="Admin" />
          <VStack gap={4} align="stretch" flex={1}>
            {navItems.map((item, index) => (
              <NavItem key={index} icon={item.icon} text={item.text} path={item.path} />
            ))}
          </VStack>
          <VStack gap={4} align="stretch" mt="auto" w={'100%'}>
            <HStack gap={3} w={'100%'}>
              <IconButton 
                aria-label="Toggle Color Mode" 
                variant="ghost"
                color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                onClick={toggleColorMode}
                _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.600' }}
                w={'100%'}
              >
                {colorMode === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
                {colorMode === 'light' ? <Text>Dark Mode</Text> : <Text>Light Mode</Text>}
              </IconButton>
            </HStack>
            <HStack gap={3}>
              <IconButton 
                aria-label="Logout" 
                variant="ghost"
                color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.600' }}
                w={'100%'}
                onClick={handleLogout}
              >
                <LogOutIcon />
                Log Out
              </IconButton>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default AdminSidebar