import { useState } from 'react'
import { Button, HStack } from '@chakra-ui/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <HStack>
      <Button>
        mewing
      </Button>
    </HStack>
  )
}

export default App
