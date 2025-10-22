import { Box, Button, Center, FileUpload, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useDataContext } from "./contexts/DataContext";
import { useEffect, useState } from "react";
import { parseCSV } from "./lib/fileActions";
import { fixData, validateData } from "./lib/validation";
import type { ValidationResult } from "./lib/types";
import DuplicateRows from "./components/validation/DuplicateRows";
import MissingRows from "./components/validation/MissingRows";
import UnknownRows from "./components/validation/UnknownRows";
import IncorrectRows from "./components/validation/IncorrectRows";
import { useNavigate } from "react-router";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);
  const { data, setData } = useDataContext();

  return (
    <Center>
      <Stack>
        <Text fontWeight={"bold"} fontSize={"3xl"}>
          Welcome
        </Text>
        {!file && (
          <>
            <Text>No file detected, please upload a file.</Text>
            <Text color="fg.muted" fontSize={"sm"}>
              For more info, please read below.
            </Text>
            <Dropzone setFile={setFile} />
          </>
        )}
        {file && data.length === 0 && (
          <>
            <Text>Parsing file...</Text>
            <Parsing file={file} parsing={parsing} setParsing={setParsing} setData={setData} />
          </>
        )}
        {data.length > 0 && !parsing && <Validation />}
      </Stack>
    </Center>
  );
}

// function Skip() {
//   return (
//     <Center>
//       <Stack>
//         <Text fontWeight={"bold"} fontSize={"3xl"}>
//           Welcome back!
//         </Text>
//         <Text>Data detected, press the button below to proceed.</Text>
//         <Button>Proceed</Button>
//       </Stack>
//     </Center>
//   );
// }

function Dropzone({ setFile }: { setFile: React.Dispatch<React.SetStateAction<File | null>> }) {
  function onFileChange(details: FileUpload.FileChangeDetails): void {
    setFile(details.acceptedFiles[0]);
  }

  return (
    <FileUpload.Root alignItems="stretch" maxFiles={1} accept={"text/csv"} onFileChange={onFileChange}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.csv only</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}

function Parsing({
  file,
  parsing,
  setParsing,
  setData,
}: {
  file: File;
  parsing: boolean;
  setParsing: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
}) {
  useEffect(() => {
    async function parse() {
      try {
        setParsing(true);
        console.log("Parsing...");
        const parsedData = await parseCSV(file);
        setData(parsedData);
      } catch (e) {
        console.log(e);
      } finally {
        setParsing(false);
      }
    }
    parse();
  }, [file, setParsing, setData]);

  return (
    <>
      {parsing ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <></>
      )}
    </>
  );
}

function Validation() {
  const navigate = useNavigate();
  const { data, setData } = useDataContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ValidationResult>({
    success: false,
    error: "",
    unknown: new Set(),
    missing: new Set(),
    duplicate: new Set(),
    incorrect: [],
  });

  useEffect(() => {
    try {
      setLoading(true);
      const validation = validateData(data);
      setResult(validation);
      console.log(validation);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (result?.error) {
    return (
      <Center>
        <Stack>
          <Text>An error occured!</Text>
          <Text>{result.error}</Text>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </Stack>
      </Center>
    );
  }

  if (result?.success) {
    return (
      <Center>
        <Stack>
          <Text>Your file looks okay. :)</Text>
          <Text>Click the button below to proceed.</Text>
          <Button>Next</Button>
        </Stack>
      </Center>
    );
  } else {
    return (
      <Center width={"100vw"}>
        <Stack width={"80%"} maxW={"1000px"} >
          <Text>Oh no :(</Text>
          <Text>Your file seems to be wrong, see below:</Text>
          <Text color="fg.muted" fontSize={"sm"}>
            (Hover over the table headers for more information)
          </Text>
          <Stack gap="7" padding="4">
            {result?.duplicate.size > 0 && <DuplicateRows data={data} duplicate={result.duplicate} />}
            {result?.missing.size > 0 && <MissingRows missing={result.missing} />}
            {result?.unknown.size > 0 && <UnknownRows data={data} unknown={result.unknown} />}
            {result?.incorrect.length > 0 && <IncorrectRows data={data} incorrect={result.incorrect} />}
          </Stack>
          <Center>
            <Button
              width={"50%"}
              onClick={() => {
                fixData(data, result);
                console.log(data);
                setData(data);

                navigate("/display");
              }}
            >
              Apply fixes
            </Button>
          </Center>
        </Stack>
      </Center>
    );
  }
}
