import React from 'react';
import { Button, Flex, HStack, IconButton, Text, VStack, Spacer, For, Input } from '@chakra-ui/react';
import { MdOutlineDarkMode, MdLightMode, MdOutlineShoppingCart, MdChat} from 'react-icons/md';
import { useColorMode } from '../ui/color-mode'
import { Avatar } from '../ui/avatar';
import { Field } from '../ui/field';

function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode() // Access color mode and toggle function
    const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

    const pickPalette = (name: string) => {
        const index = name.charCodeAt(0) % colorPalette.length
        return colorPalette[index]
    }
    return (

        <HStack wrap="wrap" gap="7" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
            <HStack>
                <Text>DEPO 79</Text>
            </HStack>
            <Button
                textStyle="xs"
                w={16}
                h={11}
                background={colorMode === 'light' ? 'white' : 'gray.800'}
                color={colorMode === 'light' ? 'black' : 'white'}
                variant="outline"
            >
                Diskon
            </Button>
            <Button
                textStyle="xs"
                w={16}
                h={11}
                background={colorMode === 'light' ? 'white' : 'gray.800'}
                color={colorMode === 'light' ? 'black' : 'white'}
                variant="outline"
            >
                Alamat
            </Button>

            <Spacer />

            <HStack>
                {/* Toggle Button for Light/Dark Mode */}
                <Field w={"xs"} borderRadius="15px" outline={"1px solid black"} border={'none'} _focus={{outline: "1px solid black", borderRadius: "50px",}}>
                    <Input placeholder="Search" border={'none'} _focus={{outline: "none", boxShadow: "none",}}/>
                </Field>
                <IconButton
                    aria-label="Toggle theme"
                    variant="outline"
                    size="lg" // Use the same size as the other buttons
                    colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Same color scheme
                    onClick={toggleColorMode} // Toggle color mode when clicked
                >
                    <MdOutlineDarkMode />        {/* You can use the same icon for the toggle */}
                </IconButton>
                <IconButton
                    aria-label="Toggle theme"
                    variant="outline"
                    size="lg" // Use the same size as the other buttons
                    colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Same color scheme
                    onClick={toggleColorMode} // Toggle color mode when clicked
                >
                    <MdChat />        {/* You can use the same icon for the toggle */}
                </IconButton>
                <IconButton
                    aria-label="Toggle theme"
                    variant="outline"
                    size="lg" // Use the same size as the other buttons
                    colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Same color scheme
                    onClick={toggleColorMode} // Toggle color mode when clicked
                >
                    <MdOutlineShoppingCart />        {/* You can use the same icon for the toggle */}
                </IconButton>
                <Avatar name="Muhammad Eka" colorPalette={pickPalette("Shane Nelson")}/>
            </HStack>
        </HStack>
    );
}

export default Navbar;