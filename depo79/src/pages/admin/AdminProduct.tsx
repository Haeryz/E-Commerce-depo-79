import {
  Box,
  HStack,
  Input,
  Button,
  Text,
  Table,
  Separator
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useProductStore } from "../../store/product";
import { useBeratStore } from "../../store/berat";  // Add this import

const AdminProduct = () => {
  const { adminProducts, loading: productsLoading, error: productsError, fetchAdminProducts } = useProductStore();
  const { beratMap, loading: beratLoading, fetchBerat } = useBeratStore();  // Add this line

  useEffect(() => {
    fetchAdminProducts();
    fetchBerat();  // Add this line
  }, [fetchAdminProducts, fetchBerat]);

  if (productsLoading || beratLoading) return <Box p={5}>Loading...</Box>;
  if (productsError) return <Box p={5}>Error: {productsError}</Box>;

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
          <HStack mt={5} gap={2}>
            <Button colorScheme="gray" bg="gray.200" color="black" borderRadius={30}>
              Status
            </Button>
            <Button colorScheme="gray" bg="gray.200" color="black" borderRadius={30}>
              Date
            </Button>
            <Button colorScheme="gray" bg="gray.200" color="black" borderRadius={30}>
              Total 
            </Button>
          </HStack>
        </HStack>

        <Separator variant={"solid"} size={"lg"} mb={5} mt={5} borderColor={"gray.800"}/>

        {/* Table Section */}
        <Table.Root variant="line" >
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
            {adminProducts.map((product) => (
              <Table.Row key={product._id}>
                <Table.Cell>#{product._id}</Table.Cell>
                <Table.Cell>{product.nama}</Table.Cell>
                <Table.Cell>Rp. {product.harga_jual.toLocaleString()}</Table.Cell>
                <Table.Cell>Rp. {product.harga_beli.toLocaleString()}</Table.Cell>
                <Table.Cell>{product.stok}</Table.Cell>
                <Table.Cell>{product.diskon}%</Table.Cell>
                <Table.Cell>{product.berat.value} {beratMap[product.berat.unit]}</Table.Cell>
                <Table.Cell>
                  <Button size="sm" colorScheme="gray">
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
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
      <Box position="fixed" bottom={8} right={8}>
        <Button
          colorScheme="blackAlpha"
          bg="black"
          color="white"
          borderRadius="full"
          w="50px"
          h="50px"
          boxShadow="lg"
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "xl",
          }}
          transition="all 0.2s"
        >
          +
        </Button>
      </Box>
    </Box>
  );
};

export default AdminProduct;
