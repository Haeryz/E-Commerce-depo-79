"use client"

import {
  Box,
  HStack,
  Input,
  Button,
  Table,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProductStore } from "../../store/product";
import { useBeratStore } from "../../store/berat";
import { useSearchStore } from "../../store/search"; // Add this import
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field } from "../../components/ui/field";
import { NativeSelectField, NativeSelectRoot } from "../../components/ui/native-select";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "../../components/ui/file-upload";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination";

// Add this interface for PageChangeDetails
interface PageChangeDetails {
  page: number;
}

const AdminProduct = () => {
  const { adminProducts, loading: productsLoading, error: productsError, fetchAdminProducts, totalPages: storeTotalPages } = useProductStore();
  const { beratMap, loading: beratLoading, fetchBerat } = useBeratStore();
  const { results, fetchSuggestions, clearResults } = useSearchStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchAdminProducts(currentPage, itemsPerPage);
    }
    fetchBerat();
  }, [fetchAdminProducts, fetchBerat, currentPage, itemsPerPage, isSearching]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery !== '') {  // Changed from Boolean(searchQuery.trim())
      setIsSearching(true);
      fetchSuggestions(searchQuery);
    } else {
      setIsSearching(false);
      clearResults();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setIsSearching(false);
      clearResults();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (details: PageChangeDetails) => {
    const newPage = details.page;
    setCurrentPage(newPage);
    fetchAdminProducts(newPage, itemsPerPage);
  };

  const renderProductRow = (product: any) => (
    <Table.Row key={product._id}>
      <Table.Cell>#{product._id || 'N/A'}</Table.Cell>
      <Table.Cell>{product.nama || 'N/A'}</Table.Cell>
      <Table.Cell>Rp. {(product.harga_jual || 0).toLocaleString()}</Table.Cell>
      <Table.Cell>Rp. {(product.harga_beli || 0).toLocaleString()}</Table.Cell>
      <Table.Cell>{product.stok || 0}</Table.Cell>
      <Table.Cell>{product.diskon || 0}%</Table.Cell>
      <Table.Cell whiteSpace="nowrap">
        {product.berat ? `${product.berat.value || 0} ${beratMap[product.berat.unit] || 'N/A'}` : 'N/A'}
      </Table.Cell>
      <Table.Cell>
        <HStack gap={2}>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button size="sm" colorScheme="gray">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Barang</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <VStack gap={6}>
                  <Field label="Nama">
                    <Input name="nama" />
                  </Field>
                  <HStack gap={6}>
                    <Field label="Harga jual">
                      <Input name="Harga jual" type="Number" />
                    </Field>
                    <Field label="Harga Beli">
                      <Input name="Harga Beli" type="Number" />
                    </Field>
                  </HStack>
                  <Field label="Stok">
                    <Input name="Stok" type="Number" />
                  </Field>
                  <HStack gap={6}>
                    <Field label="Diskon">
                      <Input name="Diskon" type="Number" />
                    </Field>
                    <Field label="Berat">
                      <Input name="Berat" type="Number" />
                    </Field>
                    <Field label="Satuan berat">
                      <NativeSelectRoot>
                        <NativeSelectField
                          name="Satuan berat"
                          items={Object.values(beratMap)}
                        />
                      </NativeSelectRoot>
                    </Field>
                  </HStack>
                  <FileUploadRoot maxW="xl" alignItems="stretch">
                    <FileUploadDropzone
                      label="Upload product images"
                      description="PNG or JPG, up to 5MB per file"
                    />
                    <FileUploadList />
                  </FileUploadRoot>
                </VStack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant={'outline'}>Batalkan</Button>
                </DialogActionTrigger>
                <Button>Simpan</Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
          <Button size="sm" colorScheme="red" bg="red.500">
            Hapus
          </Button>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );

  if (productsLoading || beratLoading) return <Box p={5}>Loading...</Box>;
  if (productsError) return <Box p={5}>Error: {productsError}</Box>;

  return (
    <Box w={"85%"} p={5} h={"100vh"}>
      <Box borderRadius={"md"} boxShadow={"md"} h="100%" display="flex" flexDirection="column">
        {/* Search and Filter Section - Fixed */}
        <Box>
          <HStack gap={4} p={5} borderBottom="1px" flexWrap="wrap">
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <HStack w="full" gap={2}>
                <Input 
                  placeholder="Cari Barang" 
                  borderRadius={"md"} 
                  w="90%" 
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  type="submit"
                  colorScheme="blackAlpha" 
                  w="10%" 
                >
                  Cari
                </Button>
              </HStack>
            </form>
          </HStack>

        </Box>

        {/* Table Section - Scrollable */}
        <Box flex="1" overflowY="hidden">
          <Table.Root variant="line" stickyHeader>
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
              {(isSearching ? results : adminProducts).map(renderProductRow)}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <Box py={4}>
                    {!isSearching && (
                      <PaginationRoot 
                        count={storeTotalPages} 
                        pageSize={1} 
                        page={currentPage} // Use controlled page prop instead of defaultPage
                        onPageChange={handlePageChange}
                      >
                        <HStack justify="center" gap={4}>
                          <PaginationPrevTrigger />
                          <PaginationItems />
                          <PaginationNextTrigger />
                        </HStack>
                      </PaginationRoot>
                    )}
                  </Box>
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table.Root>
        </Box>
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