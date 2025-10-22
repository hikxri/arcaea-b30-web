import { Center, Field, NumberInput, Stack, Text } from "@chakra-ui/react";
import Canvas from "./components/canvas/Canvas";
import { useState } from "react";

export default function Render() {
  const [rows, setRows] = useState<number>(6);

  return (
    <Center>
      <Stack justify={"center"} align={"center"}>
        <Text>Top text</Text>
        <Field.Root width={"auto"}>
          <Field.Label>Number of rows</Field.Label>
          <NumberInput.Root defaultValue={String(rows)} onValueChange={(e) => setRows(e.valueAsNumber)}>
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.HelperText>Enter a number between 1 and 20, inclusive</Field.HelperText>
        </Field.Root>
        <Canvas rows={rows}/>
      </Stack>
    </Center>
  );
}
