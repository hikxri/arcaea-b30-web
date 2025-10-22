import { Table } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { FaArrowRightLong, FaRegCircle, FaX } from "react-icons/fa6";

export function IncorrectTable({ rows, showHeader = true }: { rows: Record<string, string>[]; showHeader?: boolean }) {
  return (
    <Table.Root minW={"500px"} interactive borderYWidth={"1px"} showColumnBorder>
      <Table.ColumnGroup>
        <Table.Column htmlWidth={"5%"} />
        <Table.Column htmlWidth={"40%"} />
        <Table.Column htmlWidth={"10%"} />
        <Table.Column htmlWidth={"15%"} />
        <Table.Column htmlWidth={"15%"} />
        <Table.Column />
        <Table.Column htmlWidth={"15%"} />
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
            <Tooltip showArrow positioning={{ placement: "top" }} content="The wrong information">
              <Table.ColumnHeader key="value" textAlign={"center"}>
                Value
              </Table.ColumnHeader>
            </Tooltip>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Actual value">
              <Table.ColumnHeader key="actual" justifyItems={"center"} borderRightWidth={"0px"}>
                <FaX />
              </Table.ColumnHeader>
            </Tooltip>
            <Table.ColumnHeader key="arrow" textAlign={"center"} borderXWidth={"0px"}></Table.ColumnHeader>
            <Tooltip showArrow positioning={{ placement: "top" }} content="Expected value">
              <Table.ColumnHeader key="expected" justifyItems={"center"}>
                <FaRegCircle />
              </Table.ColumnHeader>
            </Tooltip>
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {rows.map((row, index) => (
          <Table.Row key={`row-${index}`}>
            <Table.Cell textAlign={"end"}>{row["index"]}</Table.Cell>
            <Table.Cell>{row["Title"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["Difficulty"]}</Table.Cell>
            <Table.Cell textAlign={"center"}>{row["value"]}</Table.Cell>
            <Table.Cell textAlign={"center"} borderRightWidth={"0px"}>{row["actual"]}</Table.Cell>
            <Table.Cell textAlign={"center"} borderXWidth={"0px"}>
              <FaArrowRightLong />
            </Table.Cell>
            <Table.Cell textAlign={"center"}>{row["expected"]}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
