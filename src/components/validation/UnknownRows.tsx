import { Flex, Stack, Text } from "@chakra-ui/react";
import { MiniRowTable } from "../tables/MiniRowTable";
import QuestionToolTip from "./QuestionTooltip";

export default function UnknownRows({ data, unknown }: { data: Record<string, string>[]; unknown: Set<number> }) {
  const count = unknown.size;
  const unknownRows = Array.from(unknown).map((index) => {
    return { ...data[index], Index: String(index + 2) };
  });

  return (
    <Stack>
      <Flex justify="center" align="center" gap="2">
        <Text>There are {count} unknown row(s) in your file:</Text>
        <QuestionToolTip text="These songs are not in the game, are you sure you spelled the title right?" />
      </Flex>
      <MiniRowTable rows={unknownRows} />
    </Stack>
  );
}
