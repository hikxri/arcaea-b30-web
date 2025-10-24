import {
  Box,
  Button,
  Center,
  Checkbox,
  Field,
  Grid,
  GridItem,
  Input,
  NumberInput,
  Spinner,
  Stack,
  Text,
  type CheckboxCheckedChangeDetails,
} from "@chakra-ui/react";
import Canvas, { type CanvasOptions, type CanvasProps, type CanvasToggles } from "./components/canvas/Canvas";
import { useCallback, useState } from "react";
import { useDataContext } from "./contexts/DataContext";
import { sortData } from "./lib/dataActions";
import {
  getLocalData,
  getLocalUsername,
  getLocalUserPotential,
  setLocalUsername,
  setLocalUserPotential,
} from "./lib/storageActions";

export default function Render() {
  const [rows, setRows] = useState<number>(6);
  const [username, setUsername] = useState<string>(getLocalUsername());
  const [potential, setPotential] = useState<number>(getLocalUserPotential());
  const [options, setOptions] = useState<CanvasOptions>({
    toggles: { avg: true, max: true, solidBg: false },
    customize: { bgColor: "#130921" },
  });

  // form hack to stop Canvas from re-rendering every time you type something
  const [formData, setFormData] = useState<CanvasProps | null>(null);
  // prevents Canvas from re-rendering
  const handleRendered = useCallback(() => setLoading(false), []);

  const [loading, setLoading] = useState<boolean>(false);

  let data = useDataContext().data;
  if (data.length === 0) data = getLocalData();

  const sorted = sortData(data);
  const topEntries = sorted.slice(0, rows * 5);

  return (
    <Center>
      <Stack justify={"center"} align={"center"} gapY={6}>
        <Text fontWeight={"bold"} fontSize={"3xl"}>
          Render your card!
        </Text>
        <Grid templateColumns={"repeat(2, 1fr)"} gapX={10} gapY={3}>
          <GridItem>
            <RowsInput rows={rows} setRows={setRows} />
          </GridItem>
          <GridItem>
            <UsernameInput username={username} setUsername={setUsername} />
          </GridItem>
          <GridItem>
            <PotentialInput ptt={potential} setPtt={setPotential} />
          </GridItem>
          <GridItem>
            <OptionsCheckbox options={options} setOptions={setOptions} />
          </GridItem>
        </Grid>
        <Field.Root width={"auto"} alignItems={"center"}>
          <Button fontWeight="bold" onClick={() => handleRender()} loading={loading} loadingText="Rendering...">
            Render
          </Button>
          <Field.HelperText>Loading song jackets might take a few seconds, please be patient!</Field.HelperText>
        </Field.Root>
        {loading && (
          <Stack alignItems={"center"}>
            <Spinner size="xl" />
            <Text>Rendering...</Text>
          </Stack>
        )}
        {formData && (
          <Box display={loading ? "none" : "block"}>
            <Canvas
              key={formData ? "0" : "1"}
              topEntries={formData.topEntries}
              rows={formData.rows}
              username={formData.username}
              potential={formData.potential}
              options={formData.options}
              onRendered={handleRendered}
            />
          </Box>
        )}
      </Stack>
    </Center>
  );

  function handleRender() {
    setLoading(true);
    setFormData({ topEntries, username, rows, potential, options });
    setLocalUsername(username);
    setLocalUserPotential(potential);
  }
}

function RowsInput({ rows, setRows }: { rows: number; setRows: (rows: number) => void }) {
  return (
    <Field.Root width={"auto"}>
      <Field.Label>Number of rows</Field.Label>
      <NumberInput.Root defaultValue={String(rows)} min={6} max={20} onValueChange={(e) => setRows(e.valueAsNumber)}>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>Enter a number between 6 and 20</Field.HelperText>
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
      <NumberInput.Root
        defaultValue={String(ptt)}
        min={0}
        max={14}
        step={0.01}
        onValueChange={(e) => setPtt(e.valueAsNumber)}
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      <Field.HelperText>Enter a float between 0 and 14</Field.HelperText>
    </Field.Root>
  );
}

function OptionsCheckbox({
  options,
  setOptions,
}: {
  options: CanvasOptions;
  setOptions: React.Dispatch<React.SetStateAction<CanvasOptions>>;
}) {
  return (
    <Stack>
      <Field.Root>
        <Field.Label>Options</Field.Label>
      </Field.Root>
      <ToggleCheckbox val={"avg"} label={"Show average potential"} />
      <ToggleCheckbox val={"max"} label={"Show max potential"} />
      <ToggleCheckbox val={"solidBg"} label={"Solid background color"} />
    </Stack>
  );

  function handleToggle(val: keyof CanvasToggles, e: CheckboxCheckedChangeDetails) {
    setOptions((prev) => {
      console.log(prev, val, e);
      return { ...prev, toggles: { ...prev.toggles, [val]: !!e.checked } };
    });
  }

  function ToggleCheckbox({ val, label }: { val: keyof CanvasToggles; label: string }) {
    return (
      <Checkbox.Root key={val} checked={options.toggles[val]} onCheckedChange={(e) => handleToggle(val, e)}>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Root>
    );
  }
}
