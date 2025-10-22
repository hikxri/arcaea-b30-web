import { Flex, Stack, Text } from "@chakra-ui/react";
import QuestionToolTip from "./QuestionTooltip";
import type { IncorrectRow } from "../../lib/types";
import { IncorrectTable } from "../tables/IncorrectTable";
import { ShowMoreRows } from "../tables/ShowMoreRows";
import { shortValuesMap } from "../../lib/types";

export default function IncorrectRows({
  data,
  incorrect,
}: {
  data: Record<string, string>[];
  incorrect: IncorrectRow[];
}) {
  const count = incorrect.length;

  const incorrectRows = incorrect.map((obj) => {
    const row = data[obj.index];
    const { index, value, expected, actual } = obj;
    return {
      title: row.title,
      diff: row.diff,
      index: String(index + 2),
      value: shortValuesMap[value],
      expected,
      actual,
    };
  });

  return (
    <Stack>
      <Flex justify="center" align="center" gap="2">
        <Text>There are {count} incorrect row(s) in your file:</Text>
        <QuestionToolTip text="These songs have the wrong information in your file." />
      </Flex>
      <ShowMoreRows cond={count > 5}>
        {(showAll) => (
          <IncorrectTable rows={showAll ? incorrectRows : incorrectRows.slice(0, 5)} />
        )}
      </ShowMoreRows>
    </Stack>
  );
}
