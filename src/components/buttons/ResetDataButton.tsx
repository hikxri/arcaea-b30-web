import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

export default function ResetDataButton({ onClick }: { onClick: () => void }) {
  return (
    <Dialog.Root size={"xs"} placement={"center"}>
      <Dialog.Trigger asChild>
        <Button width={"auto"} variant={"outline"}>Reset data</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>Are you sure you want to reset your data? This action cannot be undone.</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={onClick}>Reset</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}