export const isValidProductData = (data) => {
  const validTypes = {
    nama: "string",
    harga_jual: "number",
    harga_beli: "number",
    stok: "number",
    diskon: "number",
    "berat.value": "number",
    "berat.unit": "string",
    letak_rak: "string",
    keterangan: "string",
    kategori: "string",
    image: "string",
    terjual: "number",
  };

  // Check data types
  for (const [key, value] of Object.entries(data)) {
    if (validTypes[key] && typeof value !== validTypes[key]) {
      return false;
    }
  }

  // Validate numeric constraints
  if (data.diskon !== undefined && (data.diskon < 0 || data.diskon > 100))
    return false;
  if (data.stok !== undefined && data.stok < 0) return false;
  if (data.terjual !== undefined && data.terjual < 0) return false;
  if (data.berat?.value !== undefined && data.berat.value < 0) return false;

  return true;
};
