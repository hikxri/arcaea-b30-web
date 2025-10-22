import { createContext, useContext } from "react";

type DataContextType = {
  data: Record<string, string>[],
  setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>,
};

export const DataContext = createContext<DataContextType>({
  data: [],
  setData: () => {},
})

export function useDataContext() {
  return useContext(DataContext);
}