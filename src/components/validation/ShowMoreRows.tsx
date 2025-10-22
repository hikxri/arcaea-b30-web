import { Button, Stack } from "@chakra-ui/react";
import { useState } from "react";

export function ShowMoreRows({ cond, children }: { cond: boolean; children: (showAll: boolean) => React.ReactNode }) {
  const [showAll, setShowAll] = useState<boolean>(false);
  if (!cond) return children(showAll);
  return (
    <Stack alignItems={"center"}>
      <ShowButton showAll={showAll} setShowAll={setShowAll} />
      {children(showAll)}
      <ShowButton showAll={showAll} setShowAll={setShowAll} />
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
