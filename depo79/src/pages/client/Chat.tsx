"use client";

import { DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader } from '../../components/ui/drawer';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/auth';
import { Input } from '@chakra-ui/react';
import { Field } from '../../components/ui/field';

function Chat() {
  const { user } = useAuthStore((state) => state); // Access user and authentication state

  return (
    <DrawerContent>
      <DrawerHeader>
        {user ? ( // Check if user exists
          <Button borderRadius={40}>
            {user.name.charAt(0).toUpperCase()}
          </Button>
        ) : (
          <Button borderRadius={40}>Guest</Button> // Fallback for unauthenticated state
        )}
      </DrawerHeader>
      <DrawerBody>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </DrawerBody>
      <DrawerFooter>
        <Field
          w={'xs'}
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
      </DrawerFooter>
      <DrawerCloseTrigger />
    </DrawerContent>
  );
}

export default Chat;
