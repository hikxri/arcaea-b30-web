import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useDataContext } from "./contexts/DataContext";
import { FullRowTable } from "./components/tables/FullRowTable";
import { ShowMoreRows } from "./components/tables/ShowMoreRows";
import { useNavigate } from "react-router";

export default function Display() {
  const navigate = useNavigate();
  const { data } = useDataContext();
  const dataToShow = data.map((row, index) => ({ ...row, index: String(index + 2) }));

  return (
    <div>
      <Center>
        <Stack>
          <Text>Data after fixing:</Text>
          <Center>
            <Button onClick={() => saveData()}>Save data</Button>
          </Center>
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