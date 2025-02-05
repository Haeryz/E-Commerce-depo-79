import { Button, VStack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { useColorMode } from '../ui/color-mode';
import { useAuthStore } from '../../store/auth';

interface ProfilePopoverProps {
    userName: string;
    isPopoverOpen: boolean;
    setIsPopoverOpen: (open: boolean) => void;
    handlePesananClick: () => void;
    handleNavigateToTop: (e: React.MouseEvent<HTMLButtonElement>, targetUrl: string) => void;
}

const ProfilePopover = ({ 
    userName, 
    isPopoverOpen, 
    setIsPopoverOpen, 
    handlePesananClick,
    handleNavigateToTop 
}: ProfilePopoverProps) => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    return (
        <PopoverRoot open={isPopoverOpen} onOpenChange={(e) => setIsPopoverOpen(e.open)}>
            <PopoverTrigger asChild>
                <Button borderRadius={40}>
                    {userName.charAt(0).toUpperCase()}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                borderRadius="md"
                boxShadow="lg"
                backgroundColor={colorMode === "light" ? "white" : "gray.700"}
            >
                <PopoverArrow />
                <PopoverBody>
                    <VStack>
                        <Text mb="0">{userName}</Text>
                        <Button
                            pl={10}
                            pr={10}
                            onClick={(e) => handleNavigateToTop(e, "/profile/profile-sidebar")}
                        >
                            Setting
                        </Button>
                        <Button
                            pl={6}
                            pr={7}
                            onClick={(e) => handleNavigateToTop(e, "/profile")}
                        >
                            Buy History
                        </Button>
                        <Button onClick={(e) => handleNavigateToTop(e, "/profile")}>
                            Review History
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePesananClick}
                        >
                            Pesanan
                        </Button>
                        <Button
                            color={colorMode === "light" ? "white" : "black"}
                            backgroundColor={colorMode === "light" ? "red" : "pink"}
                            onClick={() => useAuthStore.getState().logout(() => navigate("/"))}
                        >
                            Logout
                        </Button>
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};

export default ProfilePopover;
