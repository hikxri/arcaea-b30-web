import { Stack, Text } from "@chakra-ui/react";
import { MiniRowTable } from "../tables/MiniRowTable";
import { ShowMoreRows } from "./ShowMoreRows";

export default function DuplicateRows({
  data,
  duplicate,
}: {
  data: Record<string, string>[];
  duplicate: Set<number[]>;
}) {
  const count = duplicate.size;
  const duplicateRows = Array.from(duplicate).map((rows) =>
    rows.map((index) => {
      return { ...data[index], Index: String(index + 2) };
    })
  );

  return (
    <Stack>
      <Text>There are {count} groups of duplicate rows in your file:</Text>
      <ShowMoreRows cond={count > 5}>
        {(showAll) => (
          <Stack gap="3">
            {(showAll ? duplicateRows : duplicateRows.slice(0, 5)).map((rows, index) => (
              <MiniRowTable rows={rows} showHeader={index === 0} />
            ))}
          </Stack>
        )}
      </ShowMoreRows>
    </Stack>
  );
}
