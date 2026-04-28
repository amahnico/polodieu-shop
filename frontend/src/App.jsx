import { BrowserRouter, Routes, Route } from "react-router-dom";

import Admin from "./Admin";
import Login from "./Login";
// import other pages if you have them

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User login (old system) */}
        <Route path="/login" element={<Login />} />

        {/* Admin panel (NEW) */}
        <Route path="/admin" element={<Admin />} />

        {/* Optional: redirect root to admin or homepage */}
        <Route path="/" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;