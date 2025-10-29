import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useDataContext } from "./contexts/DataContext";
import { FullRowTable } from "./components/tables/FullRowTable";
import { ShowMoreRows } from "./components/tables/ShowMoreRows";
import { useNavigate } from "react-router";
import { getLocalData } from "./lib/storageActions";
import { useEffect } from "react";
import { getUnknownHeaders } from "./lib/dataActions";

export default function Display() {
  // checks if user just wants to check their data or if they just uploaded their data
  let isLocal = false;

  const navigate = useNavigate();
  let { data } = useDataContext();

  if (data.length === 0) {
    data = getLocalData();
    isLocal = true;
  }

  useEffect(() => {
    if (data.length === 0) {
      navigate("/");
    }
  }, [data, navigate]);

  const dataToShow = data.map((row, index) => ({ ...row, index: String(index + 2) }));
  const unknownHeaders = getUnknownHeaders(data[0]);

  return (
    <div>
      <Center>
        <Stack justify={"center"} align={"center"} gapY={4}>
          <Text fontWeight={"bold"} fontSize={"3xl"}>
            Data display
          </Text>
          <Center>
            {!isLocal ? (
              <Button onClick={() => saveData()}>Save data</Button>
            ) : (
              <Button onClick={() => navigate("/render")}>To render</Button>
            )}
          </Center>
          {unknownHeaders.length > 0 && (
            <Text>
              These {unknownHeaders.length} headers are not displayed: "{unknownHeaders.join('", "')}".
            </Text>
          )}
          <ShowMoreRows cond={dataToShow.length > 5}>
            {(showAll) => <FullRowTable rows={showAll ? dataToShow : dataToShow.slice(0, 5)} />}
          </ShowMoreRows>
        </Stack>
      </Center>
    </div>
  );

  function saveData() {
    localStorage.setItem("data", JSON.stringify(data));
    navigate("/render");
  }
}
