import { Box, HStack, Table, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const AdminHome: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Sales 2024',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Penjualan'
      }
    }
  }

  const { colorMode } = useColorMode()

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <HStack w={'100%'} h={'100%'}>
        <VStack w={'70%'} h={'100%'} justifyContent={'space-between'} align={'start'}>
          <Box height="80%"
            w="100%"
            p={4}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            borderRadius={8}
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
          >
            <Line data={data} options={options} />
          </Box>
          <Box height="40%"
            w="100%"
            p={4}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            borderRadius={8}
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
          >
            <Text>
              New Order
            </Text>
            <HStack>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Order</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                    <Table.ColumnHeader>Total</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
              </Table.Root>
            </HStack>
          </Box>
        </VStack>
        <VStack w={'30%'} h={'100%'} justifyContent={'space-between'} align={'start'}>
          <Box height="33%"
            w="100%"
            p={4}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            borderRadius={8}
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
          >
          </Box>
          <Box height="33%"
            w="100%"
            p={4}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            borderRadius={8}
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
          >
          </Box>
          <Box height="33%"
            w="100%"
            p={4}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            borderRadius={8}
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
          >
          </Box>
        </VStack>
      </HStack>

    </Box>
  )
}

export default AdminHome