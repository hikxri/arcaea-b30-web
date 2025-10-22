import { Flex, Stack, Text } from "@chakra-ui/react";
import { SCORES } from "../../lib/validation";
import { MiniRowTable } from "../tables/MiniRowTable";
import QuestionToolTip from "./QuestionTooltip";
import { ShowMoreRows } from "./ShowMoreRows";

export default function MissingRows({ missing }: { missing: Set<number> }) {
  const count = missing.size;
  const missingRows = Array.from(missing).map((index) => {
    return { ...SCORES[index], Index: String(index + 2) };
  });

  return (
    <Stack>
      <Flex justify="center" align="center" gap="2">
        <Text>There are {count} missing row(s) from your file:</Text>
        <QuestionToolTip text="These songs are in the game, but are not in your file."/>
      </Flex>
      <ShowMoreRows cond={count > 5}>
        {(showAll) => (
          <MiniRowTable rows={showAll ? missingRows : missingRows.slice(0, 5)} /> 
        )}
      </ShowMoreRows>
    </Stack>
  );
}
