import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function DetailBarang() {
    return (
        <Box>
            <VStack>
                <HStack>
                    <VStack align={"start"}>
                        <Text>
                            Ngawi
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    )
}

export default DetailBarang