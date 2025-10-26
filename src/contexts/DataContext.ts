import { createContext, useContext } from "react";
import { getLocalData } from "../lib/storageActions";

type DataContextType = {
  data: Record<string, string>[],
  setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>,
};

export const DataContext = createContext<DataContextType>({
  data: getLocalData(),
  setData: () => {},
})

export function useDataContext() {
  return useContext(DataContext);
}