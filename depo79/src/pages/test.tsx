import { For, HStack } from '@chakra-ui/react'
import { Button } from '../components/ui/button'
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../components/ui/dialog'

function test() {
  return (
    <HStack>
    <For each={["xs", "sm", "md", "lg"]}>
      {(size) => (
        <DialogRoot key={size} size={size}>
          <DialogTrigger asChild>
            <Button variant="outline" size={size}>
              Open ({size})
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button>Save</Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      )}
    </For>
  </HStack>
  )
}

export default test