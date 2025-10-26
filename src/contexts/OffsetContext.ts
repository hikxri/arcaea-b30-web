import { createContext, useContext } from "react";
import { getLocalOffset } from "../lib/storageActions";

type OffsetContextType = {
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
};

export const OffsetContext = createContext<OffsetContextType>({
  offset: getLocalOffset(),
  setOffset: () => {},
})

export function useOffsetContext() {
  return useContext(OffsetContext);
}