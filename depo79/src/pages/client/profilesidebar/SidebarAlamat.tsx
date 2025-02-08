import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { LuMapPin } from 'react-icons/lu';
import { Field } from '../../../components/ui/field';
import { useAlamatStore } from '../../../store/alamat';

function SidebarAlamat() {
  const { alamat, loading, fetchAlamat } = useAlamatStore();

  useEffect(() => {
    fetchAlamat();
  }, [fetchAlamat]);

  if (loading) {
    return <Text>Loading alamat...</Text>;
  }

  if (!alamat) {
    return <Text>No address found.</Text>;
  }

  return (
    <Box px={[4, 6, 10]} py={[4, 6, 8]} height="auto">
      <VStack align="start" height="100%">
        <HStack gapX={4} wrap="wrap">
          <LuMapPin size={40} />
          <Text fontWeight="bold" fontSize={["2xl", "3xl", "4xl"]} color={"black"}>
            INFORMASI ALAMAT
          </Text>
        </HStack>
        <VStack
          mt={10}
          align="start"
          gap={4}
          width={["100%", "70%", "100%"]}
        >
          <Field label="Provinsi" maxW="100%">
            <Input value={alamat.provinsi} readOnly={true} size={["sm", "md"]} />
          </Field>
          <Field label="Kota" maxW="100%">
            <Input value={alamat.kota} readOnly={true} size={["sm", "md"]} />
          </Field>
          <Field label="Kode Pos" maxW="100%">
            <Input value={alamat.kodepos} readOnly={true} size={["sm", "md"]} />
          </Field>
          <Field label="Kelurahan" maxW="100%">
            <Input value={alamat.kelurahan} readOnly={true} size={["sm", "md"]} />
          </Field>
          <Field label="Kecamatan" maxW="100%">
            <Input value={alamat.kecamatan} readOnly={true} size={["sm", "md"]} />
          </Field>
          <Field label="Detail" maxW="100%">
            <Input value={alamat.detail} readOnly={true} size={["sm", "md"]} />
          </Field>
        </VStack>
      </VStack>
    </Box>
  );
}

export default SidebarAlamat;