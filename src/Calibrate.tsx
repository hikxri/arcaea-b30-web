import { Center, HStack, IconButton, NumberInput, Stack, Text } from "@chakra-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu";
import CalibrationCanvas from "./components/canvas/CalibrationCanvas";
import { useOffsetContext } from "./contexts/OffsetContext";
import { setLocalOffset } from "./lib/storageActions";

export default function Calibrate() {
  const { offset, setOffset } = useOffsetContext();

  return (
    <Center>
      <Stack justify={"center"} align={"center"}>
        <Text fontWeight={"bold"} fontSize={"3xl"}>
          Calibrate
        </Text>
        <Text>
          Adjust the value below so that the text is{" "}
          <strong>
            <u>centered</u>
          </strong>
          .
        </Text>
        <OffsetAdjuster offset={offset} onChange={handleChange} />
        <CalibrationCanvas offset={offset} />
      </Stack>
    </Center>
  );

  function handleChange(value: number) {
    setOffset(value);
    setLocalOffset(value);
  }
}

function OffsetAdjuster({ offset, onChange }: { offset: number; onChange: (e: number) => void }) {
  return (
    <Stack margin={"2"}>
      {/* <Text>Offset</Text> */}
      <NumberInput.Root value={String(offset)} onValueChange={(e) => onChange(e.valueAsNumber)}>
        <HStack gap={"2"}>
          <NumberInput.DecrementTrigger asChild>
            <IconButton variant={"outline"} size={"sm"}>
              <LuMinus />
            </IconButton>
          </NumberInput.DecrementTrigger>
          <NumberInput.ValueText textAlign={"center"} fontSize={"lg"} />
          <NumberInput.IncrementTrigger asChild>
            <IconButton variant={"outline"} size={"sm"}>
              <LuPlus />
            </IconButton>
          </NumberInput.IncrementTrigger>
        </HStack>
      </NumberInput.Root>
    </Stack>
  );
}
