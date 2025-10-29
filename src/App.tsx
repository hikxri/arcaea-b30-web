import { HashRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./Home";
import { Provider } from "./components/ui/provider";
import { DataContext } from "./contexts/DataContext";
import { useState } from "react";
import Display from "./Display";
import Render from "./Render";
import Calibrate from "./Calibrate";
import { OffsetContext } from "./contexts/OffsetContext";
import { getLocalData, getLocalOffset } from "./lib/storageActions";
import Navbar from "./components/ui/Navbar";

export default function App() {
  const [data, setData] = useState<Record<string, string>[]>(getLocalData());
  const [offset, setOffset] = useState<number>(getLocalOffset());

  return (
    <Provider>
      <OffsetContext.Provider value={{ offset, setOffset }}>
        <DataContext.Provider value={{ data, setData }}>
          <HashRouter>
            <Navbar />
            <Routes>
              <Route index element={<Home />} />
              <Route path="display" element={<Display />} />
              <Route path="render" element={<Render />} />
              <Route path="calibrate" element={<Calibrate />} />
            </Routes>
          </HashRouter>
        </DataContext.Provider>
      </OffsetContext.Provider>
    </Provider>
  );
}
