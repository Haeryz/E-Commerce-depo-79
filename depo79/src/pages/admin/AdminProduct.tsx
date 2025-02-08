"use client";
import { Box, HStack, Input, Button, Table, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProductStore } from "../../store/product";
import { useBeratStore } from "../../store/berat";
import { useSearchStore } from "../../store/search";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Field } from "../../components/ui/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select";
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

// Interface for PageChangeDetails
interface PageChangeDetails {
  page: number;
}

const AdminProduct = () => {
  const {
    adminProducts,
    loading: productsLoading,
    error: productsError,
    fetchAdminProducts,
    totalPages: storeTotalPages,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const { beratMap, loading: beratLoading, fetchBerat } = useBeratStore();
  const {
    results,
    loading: searchLoading,
    fetchSuggestions,
    clearResults,
  } = useSearchStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    harga_jual: "",
    harga_beli: "",
    stok: "",
    diskon: "",
    berat: "",
    satuan_berat: "",
  });

  useEffect(() => {
    if (!isSearching) {
      fetchAdminProducts(currentPage, itemsPerPage);
    }
    fetchBerat();
  }, [fetchAdminProducts, fetchBerat, currentPage, itemsPerPage, isSearching]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (details: PageChangeDetails) => {
    const newPage = details.page;
    setCurrentPage(newPage);
    fetchAdminProducts(newPage, itemsPerPage);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setFormData({
      nama: product.nama || "",
      harga_jual: product.harga_jual || "",
      harga_beli: product.harga_beli || "",
      stok: product.stok || "",
      diskon: product.diskon || "",
      berat: product.berat?.value || "",
      satuan_berat: product.berat?.unit || "",
    });
  };

  const handleSaveChanges = async (id: string | undefined) => {
    if (id) {
      const updatedProduct = {
        ...editProduct,
        ...formData,
        berat: { value: formData.berat, unit: formData.satuan_berat },
      };
      try {
        // Menambahkan request ke backend dengan PUT
        const response = await fetch(`/api/product/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const data = await response.json();
        if (data.success) {
          setEditProduct(null); // Reset form setelah berhasil simpan
          fetchAdminProducts(currentPage, itemsPerPage); // Refresh data produk
        } else {
          console.error("Error updating product:", data.message);
        }
      } catch (error) {
        console.error("Error updating product", error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id); // Fungsi untuk menghapus produk
      fetchAdminProducts(currentPage, itemsPerPage); // Refresh daftar produk setelah dihapus
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const renderProductRow = (product: Product) => (
    <Table.Row key={product._id}>
      <Table.Cell>#{product._id || "N/A"}</Table.Cell>
      <Table.Cell>{product.nama || "N/A"}</Table.Cell>
      <Table.Cell>Rp. {(product.harga_jual || 0).toLocaleString()}</Table.Cell>
      <Table.Cell>Rp. {(product.harga_beli || 0).toLocaleString()}</Table.Cell>
      <Table.Cell>{product.stok || 0}</Table.Cell>
      <Table.Cell>{product.diskon || 0}%</Table.Cell>
      <Table.Cell whiteSpace="nowrap">
        {product.berat
          ? `${product.berat.value || 0} ${
              beratMap[product.berat.unit] || "N/A"
            }`
          : "N/A"}
      </Table.Cell>
      <Table.Cell>
        <HStack gap={2}>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button
                size="sm"
                colorScheme="gray"
                onClick={() => handleEditProduct(product)}
              >
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
                    <Input
                      name="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </Field>
                  <HStack gap={6}>
                    <Field label="Harga jual">
                      <Input
                        name="harga_jual"
                        type="number"
                        value={formData.harga_jual}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            harga_jual: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Harga Beli">
                      <Input
                        name="harga_beli"
                        type="number"
                        value={formData.harga_beli}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            harga_beli: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </HStack>
                  <Field label="Stok">
                    <Input
                      name="stok"
                      type="number"
                      value={formData.stok}
                      onChange={(e) =>
                        setFormData({ ...formData, stok: e.target.value })
                      }
                    />
                  </Field>
                  <HStack gap={6}>
                    <Field label="Diskon">
                      <Input
                        name="diskon"
                        type="number"
                        value={formData.diskon}
                        onChange={(e) =>
                          setFormData({ ...formData, diskon: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Berat">
                      <Input
                        name="berat"
                        type="number"
                        value={formData.berat}
                        onChange={(e) =>
                          setFormData({ ...formData, berat: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Satuan berat">
                      <NativeSelectRoot>
                        <NativeSelectField
                          name="satuan_berat"
                          items={Object.values(beratMap)}
                          value={formData.satuan_berat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              satuan_berat: e.target.value,
                            })
                          }
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
                  <Button variant={"outline"}>Batalkan</Button>
                </DialogActionTrigger>
                <Button onClick={() => handleSaveChanges(editProduct?._id)}>
                  Simpan
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
          <Button
            size="sm"
            colorScheme="red"
            bg="red.500"
            onClick={() => handleDeleteProduct(product._id)}
          >
            Hapus
          </Button>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );

  if (productsLoading || beratLoading) {
    return <Box p={5}>Loading...</Box>;
  }

  if (productsError) {
    return <Box p={5}>Error: {productsError}</Box>;
  }

  return (
    <Box w={"85%"} p={5} h={"100vh"}>
      <Box
        borderRadius={"md"}
        boxShadow={"md"}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box>
          <HStack gap={4} p={5} borderBottom="1px" flexWrap="wrap">
            <form onSubmit={handleSearch} style={{ width: "100%" }}>
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
                  loading={searchLoading}
                >
                  Cari
                </Button>
              </HStack>
            </form>
          </HStack>
        </Box>

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
                        page={currentPage}
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
