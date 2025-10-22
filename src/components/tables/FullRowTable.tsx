import { Table } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

export function FullRowTable({ rows, showHeader = true }: { rows: Record<string, string>[]; showHeader?: boolean }) {
  return (
    <Table.Root showColumnBorder minW={"500px"} interactive borderYWidth={"1px"}>
      <Table.ColumnGroup>
        <Table.Column htmlWidth={"5%"} />
        <Table.Column htmlWidth={"40%"} />
        <Table.Column htmlWidth={"10%"} />
        <Table.Column htmlWidth={"10%"} />
        <Table.Column htmlWidth={"15%"} />
        <Table.Column />
      </Table.ColumnGroup>
      {showHeader && (
        <Table.Header>
          <Table.Row>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Line number in file">
              <Table.ColumnHeader key="index" textAlign={"end"}>
                #
              </Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Song title">
              <Table.ColumnHeader key="title">Title</Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Difficulty">
              <Table.ColumnHeader key="diff" textAlign={"center"}>
                Diff
              </Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Level">
              <Table.ColumnHeader key="level" textAlign={"center"}>
                Lv
              </Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Chart constant">
              <Table.ColumnHeader key="cc" textAlign={"center"}>
                CC
              </Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Note count">
              <Table.ColumnHeader key="note" textAlign={"center"}>Notes</Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Your score on the song">
              <Table.ColumnHeader key="score" textAlign={"center"}>Score</Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="How far away you are from a max Pure Memory. '-' if you don't have a PM">
              <Table.ColumnHeader key="pmr" textAlign={"center"}>PM Rating</Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="How good your play is (0.0 to 2.0)">
              <Table.ColumnHeader key="pr" textAlign={"center"}>Play rating</Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="This affects your Potential">
              <Table.ColumnHeader key="pp" textAlign={"center"}>Play potential</Table.ColumnHeader>
            </Tooltip>
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {rows.map((row, index) => (
          <Table.Row key={`row-${index}`}>
            <Table.Cell textAlign={"end"}>{row["index"]}</Table.Cell>
            <Table.Cell>{row["title"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["diff"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["level"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["cc"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["note"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["score"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["pmr"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["pr"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["pp"]}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
