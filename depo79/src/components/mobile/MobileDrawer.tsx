import React, { useEffect, useState } from 'react'
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { IconButton, Input, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import { MdChat, MdMenu, MdOutlineDarkMode, MdOutlineShoppingCart } from 'react-icons/md'
import { Button } from '../ui/button'
import { useAuthStore } from '../../store/auth'
import { useNavigate } from 'react-router-dom'
import { useColorMode } from '../ui/color-mode'
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTrigger } from '../ui/dialog'
import { Field } from '../ui/field'

const MobileDrawer = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
    const { isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
    const { user } = useAuthStore((state) => state); // Access user and authentication state
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    aria-label="Open menu"
                    variant="ghost"
                >
                    <MdMenu />
                </IconButton>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Depo 79</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                    <VStack align="stretch" gap={4}>
                        <Button variant="ghost">Diskon</Button>
                        <Button variant="ghost">Alamat</Button>
                        <IconButton
                            aria-label="Toggle theme"
                            variant="ghost"
                            size="lg"
                            colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
                            onClick={toggleColorMode}
                        >
                            <MdOutlineDarkMode />
                            <Text>
                                Mode
                            </Text>
                        </IconButton>
                        {isAuthenticated && (
                            <>
                                <DialogRoot size={'full'}>
                                    <DialogTrigger w={'100%'} asChild>
                                        <Button variant="ghost" w={'100%'}><MdChat /> Chat</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {user ? ( // Check if user exists
                                                <Button borderRadius={40}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Button>
                                            ) : (
                                                <Button borderRadius={40}>Guest</Button> // Fallback for unauthenticated state
                                            )}
                                        </DialogHeader>
                                        <DialogBody>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            </p>
                                        </DialogBody>
                                        <DialogFooter>
                                            <Field
                                                w={'100%'}
                                                borderRadius="15px"
                                                outline={'1px solid white'}
                                                border="none"
                                                _focus={{ outline: '1px solid black', borderRadius: '50px' }}
                                            >
                                                <Input
                                                    placeholder="Ketik Disini"
                                                    border="none"
                                                    _focus={{ outline: 'none', boxShadow: 'none' }}
                                                    
                                                />
                                            </Field>
                                            <Button borderRadius={15}>Send</Button>
                                        </DialogFooter>
                                        <DialogCloseTrigger />
                                    </DialogContent>
                                </DialogRoot>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/cart')}
                                >
                                    <MdOutlineShoppingCart />
                                    Cart
                                </Button>
                                <Button variant="ghost" onClick={() => navigate("/profile/profile-sidebar")}>
                                    Settings
                                </Button>
                                <Button variant="ghost" onClick={() => navigate("/profile")}>
                                    Buy History
                                </Button>
                                <Button variant="ghost" onClick={() => navigate("/profile")}>
                                    Review History
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={() => useAuthStore.getState().logout()}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </VStack>
                </DrawerBody>
                <DrawerCloseTrigger />
            </DrawerContent>
        </DrawerRoot>
    )
}

export default MobileDrawer