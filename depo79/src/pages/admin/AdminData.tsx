import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { VStack, Box, HStack, Text } from '@chakra-ui/react'
import CustomDatePicker from '../../components/main/CustomDatePicker'
import RangeDatePicker from '../../components/main/RangeDatePicker'
import { useColorMode } from '../../components/ui/color-mode'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChartExample: React.FC = () => {
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
        text: 'Sales Comparison'
      }
    }
  }

  const { colorMode } = useColorMode()

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box height="100%"
        w="100%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)">
        <VStack w={'100%'} h={'100%'}>
          <RangeDatePicker></RangeDatePicker>
          <Box w={'100%'} h={'80%'}>
            <Line data={data} options={options} />
          </Box>
          <HStack justifyContent={'space-between'} alignSelf={'flex-start'} w={'95%'} h={'100%'}>
            <Box bg={'gray.300'} w={'50%'} borderRadius={8} p={3} h={'100%'}>
             <Text>
              Penjualan Terbanyak
             </Text>
            </Box>
            <Box bg={'gray.300'} w={'50%'} borderRadius={8} p={3} h={'100%'}>
            <Text>
              Penjualan Sedikit
             </Text>
            </Box>
            
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default LineChartExample