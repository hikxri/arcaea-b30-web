import { Center, Field, Grid, GridItem, Input, NumberInput, Stack, Text } from "@chakra-ui/react";
import Canvas from "./components/canvas/Canvas";
import { useState } from "react";
import { useDataContext } from "./contexts/DataContext";
import { sortData } from "./lib/dataActions";

export default function Render() {
  const [rows, setRows] = useState<number>(6);
  const [username, setUsername] = useState<string>("");
  const [ptt, setPtt] = useState<number>(0.0);
  let data = useDataContext().data;
  if (data.length === 0) data = JSON.parse(localStorage.getItem("data") || "[]");

  const sorted = sortData(data);
  const topEntries = sorted.slice(0, rows * 5);

  return (
    <Center>
      <Stack justify={"center"} align={"center"}>
        <Text fontWeight={"bold"} fontSize={"3xl"}>Render your card!</Text>
        <Grid templateColumns={"repeat(2, 1fr)"} gapY={3}>
          <GridItem>
            <RowsInput rows={rows} setRows={setRows} />
          </GridItem>
          <GridItem>
            <UsernameInput username={username} setUsername={setUsername} />
          </GridItem>
          <GridItem>
            <PotentialInput ptt={ptt} setPtt={setPtt} />
          </GridItem>
        </Grid>
        <Canvas topEntries={topEntries} rows={rows} username={username} potential={ptt} />
      </Stack>
    </Center>
  );
}

function RowsInput({ rows, setRows }: { rows: number; setRows: (rows: number) => void }) {
  return (
    <Field.Root width={"auto"}>
      <Field.Label>Number of rows</Field.Label>
      <NumberInput.Root defaultValue={String(rows)} min={6} max={20} onValueChange={(e) => setRows(e.valueAsNumber)}>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>Enter a number between 6 and 20, inclusive</Field.HelperText>
    </Field.Root>
  );
}

function UsernameInput({ username, setUsername }: { username: string; setUsername: (username: string) => void }) {
  return (
    <Field.Root width={"auto"}>
      <Field.Label>Username</Field.Label>
      <Input placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
    </Field.Root>
  );
}

function PotentialInput({ ptt, setPtt }: { ptt: number; setPtt: (ptt: number) => void }) {
  return (
    <Field.Root width={"auto"}>
      <Field.Label>Potential</Field.Label>
      <NumberInput.Root defaultValue={String(ptt)} min={0} max={14} step={0.01} onValueChange={(e) => setPtt(e.valueAsNumber)}>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>Enter a float between 0 and 14</Field.HelperText>
    </Field.Root>
  );
}
