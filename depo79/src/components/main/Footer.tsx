import {
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
  Separator,
  Image,
  Input,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaRegCopyright } from "react-icons/fa";
import { useColorMode } from "../ui/color-mode";
import { Link } from "react-router-dom";
import { Field } from "../ui/field";
import LogoCompany from "../../assets/LogoCompany.png";

function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack
      direction="column"
      gap={6}
      bg={colorMode === "light" ? "white" : "gray.800"}
      p={[4, 5, 8]}
    >
      {/* Main Footer Content */}
      <Flex
        direction={["column", "column", "row"]}
        w="full"
        gap={[8, 10, 10]}
        px={[4, 6, 10]}
        align="start"
        justify="space-between"
        flexWrap="wrap"
      >
        {/* Logo and Company Description Section */}
        <VStack alignItems="flex-start" gap={3} w={["full", "full", "320px"]}>
          <Link to="/">
            <Image src={LogoCompany} w={"24"} />
          </Link>
          <Text fontSize={["sm", "md"]} maxW={["full", "full", "320px"]}>
            Depo79 adalah penyedia bahan bangunan terkemuka yang menyediakan
            berbagai produk berkualitas tinggi untuk memenuhi kebutuhan
            konstruksi dan renovasi Anda. Kami berkomitmen untuk memberikan
            layanan terbaik dan harga yang kompetitif.
          </Text>
        </VStack>

        {/* Shortcut Section */}
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight="bold" fontSize={["sm", "md"]}>
            SHORTCUT
          </Text>
          <Link to="/">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              About Us
            </Text>
          </Link>
          <Link to="/">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              FAQs
            </Text>
          </Link>
        </VStack>

        {/* Sosmed Section */}
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight="bold" fontSize={["sm", "md"]}>
            SOSMED
          </Text>
          <Link to="https://www.instagram.com/azkagroup.inc" target="_blank">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              Instagram
            </Text>
          </Link>
          <Link to="https://wa.me/6285232668032" target="_blank">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              Whatsapp
            </Text>
          </Link>
        </VStack>

        {/* Contact Us Section */}
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight="bold" fontSize={["sm", "md"]}>
            CONTACT US
          </Text>
          <Link to="https://maps.app.goo.gl/zRsej2BJ1LGNvrFQ7" target="_blank">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              Jl. Raya Tulus Ayu No.171, Tulus Ayu, Tulusbesar, Kec. Tumpang,
              Kabupaten Malang, Jawa Timur 65156
            </Text>
          </Link>
          <a href="mailto:info@depo79.com">
            <Text
              fontSize={["sm", "md"]}
              color="gray.400"
              _hover={{
                cursor: "pointer",
                color: colorMode === "dark" ? "white" : "black",
              }}
            >
              info@depo79.com
            </Text>
          </a>
        </VStack>

        {/* Email Subscription Section */}
        <VStack alignItems="flex-start" gap={2} w={["full", "full", "310px"]}>
          <Text fontSize={["sm", "md"]}>
            Dapatkan Kabar Terbaru dan terupdate produk kami dan diskon untuk
            semua item
          </Text>
          <Stack direction={["column", "row"]} w="full" gap={3}>
            <Field
              w={["full", "240px"]}
              borderRadius="15px"
              outline="1px solid"
              border="none"
              borderColor={colorMode === "dark" ? "white" : "black"}
              _focus={{
                outline: "1px solid",
                borderRadius: "50px",
                borderColor: colorMode === "dark" ? "white" : "black",
              }}
            >
              <Input
                placeholder="Your Email"
                border="none"
                _focus={{
                  outline: "none",
                  boxShadow: "none",
                }}
                _selection={{ backgroundColor: "#2563eb", color: "white" }}
                aria-label="Enter your email"
              />
            </Field>
            <Button
              borderRadius="15px"
              w={["full", "auto"]}
              minW={["full", "100px"]}
              _hover={{ bg: "blue.500", color: "white" }}
              aria-label="Send email subscription request"
            >
              Kirim
            </Button>
          </Stack>
        </VStack>
      </Flex>

      <Separator />

      {/* Bottom Footer */}
      <Stack
        direction={["column", "column", "row"]}
        w="full"
        justify="space-between"
        align={["center", "center", "center"]}
        gap={[4, 4, 0]}
        px={[4, 6, 10]}
        py={2}
      >
        {/* Left side - Privacy, Terms, and Dark Mode */}
        <Stack direction={["column", "row"]} align="center" gap={[2, 4]}>
          <IconButton
            aria-label="Toggle theme"
            variant="ghost"
            size={["md", "lg"]}
            colorScheme={colorMode === "light" ? "teal" : "orange"}
            onClick={toggleColorMode}
          >
            <MdOutlineDarkMode />
          </IconButton>
          <HStack gap={2}>
            <Button
              variant="ghost"
              size={["sm", "md"]}
              color={colorMode === "light" ? "black" : "white"}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              size={["sm", "md"]}
              color={colorMode === "light" ? "black" : "white"}
            >
              Cookie
            </Button>
            <Button
              variant="ghost"
              size={["sm", "md"]}
              color={colorMode === "light" ? "black" : "white"}
            >
              Terms
            </Button>
          </HStack>
        </Stack>

        {/* Right side - Copyright */}
        <Stack direction={["column", "row"]} align="center" gap={[2, 4]}>
          <HStack>
            <IconButton
              aria-label="Copyright"
              variant="ghost"
              size="xs"
              colorScheme={colorMode === "light" ? "teal" : "orange"}
            >
              <FaRegCopyright />
            </IconButton>
            <Text fontSize={["sm", "md"]}>2025 Depo79 Production</Text>
          </HStack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Footer;
