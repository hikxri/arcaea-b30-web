import { HashRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./Home";
import { Provider } from "./components/ui/provider";
import { DataContext } from "./contexts/DataContext";
import { useState } from "react";
import Display from "./Display";
import Render from "./Render";

export default function App() {
  const [data, setData] = useState<Record<string, string>[]>([]);

  return (
    <Provider>
      <DataContext.Provider value={{ data, setData }}>
        <HashRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="display" element={<Display />} />
            <Route path="render" element={<Render />} />
          </Routes>
        </HashRouter>
      </DataContext.Provider>
    </Provider>
  );
}
