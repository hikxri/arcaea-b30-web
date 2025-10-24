import { Button, Field, Stack } from "@chakra-ui/react";
import { useState } from "react";

export function ShowMoreRows({ cond, children }: { cond: boolean; children: (showAll: boolean) => React.ReactNode }) {
  const [showAll, setShowAll] = useState<boolean>(false);
  if (!cond) return children(showAll);
  return (
    <Stack alignItems={"center"}>
      {showAll && <ShowButton showAll={showAll} setShowAll={setShowAll} />}
      {children(showAll)}
      <Field.Root width={"auto"} alignItems={"center"}>
        <ShowButton showAll={showAll} setShowAll={setShowAll} />
        <Field.HelperText>Might take a long time to load<br />(click at your and your device's own risk)</Field.HelperText>
      </Field.Root>
    </Stack>
  );
}

function ShowButton({ showAll, setShowAll }: { showAll: boolean; setShowAll: (showAll: boolean) => void }) {
  if (showAll) {
    return (
      <Button variant={"outline"} onClick={() => setShowAll(false)}>
        Show less
      </Button>
    );
  }
  return (
    <Button variant={"outline"} onClick={() => setShowAll(true)}>
      Show all
    </Button>
  );
}
