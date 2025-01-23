import { Box, createListCollection, HStack, Input, Separator, Table, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../components/ui/select'
import CustomDatePicker from '../../components/main/CustomDatePicker'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'

const AdminOrder = () => {
  const { colorMode } = useColorMode()

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box
        height="100%"
        w="75%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack align="stretch" height="100%" w={'100%'}>
          <HStack gap={4} align="stretch" width="100%">
            <SelectRoot collection={frameworks} size="sm" width="100px">
              <SelectTrigger>
                <SelectValueText placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {frameworks.items.map((movie) => (
                  <SelectItem item={movie} key={movie.value}>
                    {movie.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            <CustomDatePicker />
            <Field w={'80%'}>
              <Input placeholder="Nama Customer" />
            </Field>
            <Button>
              Search
            </Button>
          </HStack>

          <Separator />

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
        </VStack>
      </Box>
      <Box
        height="100%"
        w="25%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack align="stretch" height="100%" w={'100%'}>
          <Text>Admin Order</Text>
          {/* Add your content here */}
        </VStack>
      </Box>
    </Box>
  )
}

const frameworks = createListCollection({
  items: [
    { label: "Dibayar", value: "react" },
    { label: "Belum Dibayar", value: "vue" },
  ],
})

export default AdminOrder