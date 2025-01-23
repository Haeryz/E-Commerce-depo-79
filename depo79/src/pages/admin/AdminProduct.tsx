import {
  Box,
  HStack,
  Input,
  Button,
  Text,
  Table
} from "@chakra-ui/react";

import React from "react";

const AdminProduct = () => {
  return (
    <Box w={"full"} p={5}>
      <Box borderRadius={"md"} boxShadow={"md"} overflowX="auto" bg="white">
        {/* Search and Filter Section */}
        <HStack gap={4} p={5} borderBottom="1px" borderColor="gray.200" bg="white" flexWrap="wrap">
          <HStack w="full" gap={2}>
            <Input 
              placeholder="Cari Barang" 
              borderRadius={"md"}
              w="90%"
            />
            <Button 
              colorScheme="blackAlpha" 
              bg="black" 
              color="white"
              w="10%"
            >
              Cari
            </Button>
          </HStack>
          <HStack>
            <Button colorScheme="blackAlpha" bg="black" color="white">
              Status
            </Button>
            <Button colorScheme="blackAlpha" bg="black" color="white">
              Date
            </Button>
            <Button colorScheme="blackAlpha" bg="black" color="white">
              Total
            </Button>
          </HStack>
        </HStack>

        {/* Table Section */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Kode</Table.ColumnHeader>
              <Table.ColumnHeader>Nama Barang</Table.ColumnHeader>
              <Table.ColumnHeader>Harga Jual</Table.ColumnHeader>
              <Table.ColumnHeader>Harga Beli</Table.ColumnHeader>
              <Table.ColumnHeader>Stock</Table.ColumnHeader>
              <Table.ColumnHeader>Diskon</Table.ColumnHeader>
              <Table.ColumnHeader>Berat Satuan</Table.ColumnHeader>
              <Table.ColumnHeader>Aksi</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* Example Rows */}
            <Table.Row>
              <Table.Cell>#19874</Table.Cell>
              <Table.Cell>Semen Tiga Warna</Table.Cell>
              <Table.Cell>Rp. 3.000.000,00</Table.Cell>
              <Table.Cell>Rp. 300.000,00</Table.Cell>
              <Table.Cell>20</Table.Cell>
              <Table.Cell>10%</Table.Cell>
              <Table.Cell>1 pcs</Table.Cell>
              <Table.Cell>
                <Button size="sm" colorScheme="gray">
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>#19873</Table.Cell>
              <Table.Cell>Blyat Cyka</Table.Cell>
              <Table.Cell>Rp. 30.000.000,00</Table.Cell>
              <Table.Cell>Rp. 400.000,00</Table.Cell>
              <Table.Cell>30</Table.Cell>
              <Table.Cell>0%</Table.Cell>
              <Table.Cell>20 kg</Table.Cell>
              <Table.Cell>
                <Button size="sm" colorScheme="gray">
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>#19875</Table.Cell>
              <Table.Cell>Yeaaahh</Table.Cell>
              <Table.Cell>Rp. 400.000,00</Table.Cell>
              <Table.Cell>Rp. 30.000.000,00</Table.Cell>
              <Table.Cell>40</Table.Cell>
              <Table.Cell>30%</Table.Cell>
              <Table.Cell>20 ikat</Table.Cell>
              <Table.Cell>
                <Button size="sm" colorScheme="gray">
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={8} textAlign="center">                <Text fontSize="sm" color="gray.500">
                  End of Results
                </Text>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>

      {/* Add Button */}
      <Box position="fixed" bottom={5} right={5}>
        <Button
          colorScheme="blackAlpha"
          bg="black"
          color="white"
          borderRadius="full"
          p={4}
          fontSize="xl"
        >
          +
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProduct;
