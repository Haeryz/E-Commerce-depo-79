import { Box } from '@chakra-ui/react'
import React from 'react'
import AdminSidebar from '../components/main/AdminSidebar'

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <Box display="flex" height="100vh">
      <AdminSidebar />
      {children}
    </Box>
  )
}

export default AdminLayout