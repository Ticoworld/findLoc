import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ModernHome from "./pages/modernHome";

const App = () => {
  return (
    <main id="app_main_cont">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModernHome />} />
          <Route path="/home" element={<ModernHome />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default App;