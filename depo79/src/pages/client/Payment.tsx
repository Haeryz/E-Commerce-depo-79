import { Box, CheckboxGroup, Flex, HStack, Input, Separator, Text, Textarea, VStack, Collapsible, SimpleGrid, Float } from '@chakra-ui/react'
import React from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Button } from '../../components/ui/button'
import { CheckboxCard, CheckboxCardIndicator } from '../../components/ui/checkbox-card'

function Payment() {
  const items = [
    { value: "next", title: "Next.js", description: "Best for" },
    { value: "vite", title: "Vite", description: "Best for " },
  ]

  return (
    <VStack p={10} align={'strech'}>
      <BreadcrumbRoot fontWeight={'bold'} ml={10} mb={5} alignSelf={'flex-start'}>
        <BreadcrumbLink href='#'>
          cart
        </BreadcrumbLink>
        <BreadcrumbCurrentLink>
          checkout
        </BreadcrumbCurrentLink>
        <BreadcrumbLink href='#'>
          payment
        </BreadcrumbLink>
      </BreadcrumbRoot>

      <HStack justifyContent={'space-between'} w={'full'} px={10}>
        <Box bg="bg" shadow="md" borderRadius="md" width="70%" mb={5} boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)" >
          <VStack align={'start'} m={5}>
            <Text fontWeight={'md'} fontSize={15}>
              Pembayaran
            </Text>
            <HStack justifyContent="space-between" gapX={4} width="100%">
              <Collapsible.Root>
                <Collapsible.Trigger>
                  <CheckboxGroup defaultValue={["next"]} w={'100%'} justifyContent={'space-between'}>
                    <HStack w={'100%'} justifyContent={'space-between'}>
                    {items.map((item) => (
                        <CheckboxCard w={'500px'}
                          label={item.title}
                          description={item.description}
                          key={item.value}
                          value={item.value}
                        />
                      ))}
                    </HStack>
                  </CheckboxGroup>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <Box padding="4" borderWidth="1px" mt={3}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                  </Box>
                </Collapsible.Content>
              </Collapsible.Root>
            </HStack>
          </VStack>
        </Box>

        <Box bg="bg" shadow="md" borderRadius="md" width="30%" alignSelf={'flex-start'}>
          <VStack>
            <HStack justifyContent={'space-between'} w={'full'} mt={5}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Subtotal
              </Text>
              <Text mr={5}>
                Rp.300.000,00
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Diskon
              </Text>
              <Text mr={5}>
                Rp.0
              </Text>
            </HStack>
            <Separator />
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Grandtotal
              </Text>
              <Text mr={5}>
                Rp.300.000,00
              </Text>
            </HStack>
            <Button w={'90%'} mb={5}>
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </HStack>
    </VStack>
  )
}

export default Payment