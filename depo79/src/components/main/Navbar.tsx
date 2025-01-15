import React from 'react'
import { For, HStack, IconButton, Text, VStack} from "@chakra-ui/react"
import { LuPhone } from "react-icons/lu"

function Navbar() {
  return (
    <HStack wrap="wrap" gap="8">
      <For each={["xs"]}>
        {(size) => (
          <VStack key={size}>
            <IconButton
              aria-label="Search database"
              variant="outline"
              size={size}
            >
              <LuPhone />
            </IconButton>
            <Text textStyle="xs">{size}</Text>
          </VStack>
        )}
      </For>
    </HStack>
  )
}

export default Navbar