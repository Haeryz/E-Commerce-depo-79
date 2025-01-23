import { Box, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
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

const navItems: Array<{ icon: IconType, text: string }> = [
  { icon: FaHome, text: 'Home' },
  { icon: FaBoxArchive, text: 'Produk' },
  { icon: IoReceipt, text: 'Pesanan' },
  { icon: IoChatbubbles, text: 'Pesan' },
  { icon: FaHistory, text: 'Riwayat Pembelian' },
  { icon: BsGraphUp, text: 'Data' },
  { icon: FaStar, text: 'Review' },
]

const NavItem = ({ icon: IconComponent, text }: { icon: IconType, text: string }) => (
  <HStack gap={3} width="full">
    <IconComponent size={20} />
    <Text>{text}</Text>
  </HStack>
)

const AdminSidebar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

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
        <VStack gap={5} align="stretch" height="100%">
          <Image src={Logo} alt="Admin" />
          <VStack gap={4} align="stretch" flex={1}>
            {navItems.map((item, index) => (
              <NavItem key={index} icon={item.icon} text={item.text} />
            ))}
          </VStack>
          <VStack gap={4} align="stretch" mt="auto">
            <HStack gap={3}>
              <IconButton 
                aria-label="Toggle Color Mode" 
                variant="ghost"
                color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                onClick={toggleColorMode}
                _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.600' }}
              >
                {colorMode === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
              </IconButton>
              <Text>Dark Mode</Text>
            </HStack>
            <HStack gap={3}>
              <IconButton 
                aria-label="Logout" 
                variant="ghost"
                color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.600' }}
              >
                <LogOutIcon />
              </IconButton>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.200'}>Logout</Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default AdminSidebar