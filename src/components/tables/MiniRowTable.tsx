import { Table } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

export function MiniRowTable({ rows, showHeader = true }: { rows: Record<string, string>[]; showHeader?: boolean }) {
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
              <Table.ColumnHeader key="note">Notes</Table.ColumnHeader>
            </Tooltip>
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {rows.map((row, index) => (
          <Table.Row key={`row-${index}`}>
            <Table.Cell textAlign={"end"}>{row["Index"]}</Table.Cell>
            <Table.Cell>{row["Title"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["Difficulty"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["Level"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["Chart Constant"]}</Table.Cell>
            <Table.Cell>{row["Note Count"]}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
