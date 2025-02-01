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
    <>
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
          justify="flex-start"
        >
          {/* Logo and Company Description Section */}
          <VStack alignItems="flex-start" gap={3} w={["full", "full", "auto"]}>
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
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
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
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
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
            <Link to="https://www.instagram.com" target="_blank">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                Instagram
              </Text>
            </Link>

            <Link to="https://wa.me" target="_blank">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                Whatsapp
              </Text>
            </Link>

            <Link to="https://www.facebook.com" target="_blank">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                Facebook
              </Text>
            </Link>

            <Link to="https://www.linkedin.com" target="_blank">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                LinkedIn
              </Text>
            </Link>
          </VStack>

          {/* Contact Us Section */}
          <VStack alignItems="flex-start" gap={2}>
            <Text fontWeight="bold" fontSize={["sm", "md"]}>
              CONTACT US
            </Text>

            <Link
              to="https://www.google.com/maps/place/Jl.+Raya+Tulus+Ayu+No.27,+Tulus+Ayu,+Tulusbesar,+Kec.+Tumpang,+Kabupaten+Malang,+Jawa+Timur+65156/@-8.0186061,112.7627725,17z/data=!4m16!1m9!3m8!1s0x2dd625a09fbb0793:0x385098ff2e1ecf6e!2sJl.+Raya+Tulus+Ayu+No.27,+Tulus+Ayu,+Tulusbesar,+Kec.+Tumpang,+Kabupaten+Malang,+Jawa+Timur+65156!3b1!8m2!3d-8.0187187!4d112.762755!10e5!16s%2Fg%2F11q4jrtd0r!3m5!1s0x2dd625a09fbb0793:0x385098ff2e1ecf6e!8m2!3d-8.0187187!4d112.762755!16s%2Fg%2F11q4jrtd0r?entry=ttu&g_ep=EgoyMDI1MDEyOS4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
            >
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                Jl. Raya Tulus Ayu No.27, Tulus Ayu, Tulusbesar, Kec. Tumpang,
                Kabupaten Malang, Jawa Timur 65156
              </Text>
            </Link>

            <a
              href="https://wa.me/6285158779239"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                +6285158779239
              </Text>
            </a>

            <Link to="mailto:lab.informatika@umm.ac.id">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                lab.informatika@umm.ac.id
              </Text>
            </Link>

            <Link to="mailto:lab.informatika.umm@gmail.com">
              <Text
                fontSize={["sm", "md"]}
                color="gray.400"
                _hover={{
                  cursor: "pointer",
                  color: colorMode === "dark" ? "white" : "black", // Change hover color based on theme
                }}
              >
                lab.informatika.umm@gmail.com
              </Text>
            </Link>
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
                _focus={{
                  outline: "1px solid",
                  borderRadius: "50px",
                  borderColor: "white", // Border color will be white in dark mode when focused
                }}
                borderColor={colorMode === "dark" ? "white" : "black"} // Set border color based on color mode
              >
                <Input
                  placeholder="Your Email"
                  border="none"
                  _focus={{
                    outline: "none",
                    boxShadow: "none",
                    borderColor: colorMode === "dark" ? "white" : "black", // Set border color on focus based on color mode
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

        {/* Links Sections */}
        <Stack
          direction={["column", "column", "row"]}
          gap={[6, 8, 10]}
          w={["full", "full", "auto"]}
          ml={[0, 0, "10%"]} // Adjusted to give space to the right
          justify="center" // Centers content between Product and Sosmed
        ></Stack>
      </Stack>
      <Separator />

      {/* // Bottom Footer */}
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
    </>
  );
}

export default Footer;
