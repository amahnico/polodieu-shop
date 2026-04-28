import { BrowserRouter, Routes, Route } from "react-router-dom";

import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User login (old system) */}
        <Route path="/login" element={<Login />} />

        {/* Admin panel (NEW secured) */}
        <Route path="/admin" element={<Admin />} />

        {/* Default route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;