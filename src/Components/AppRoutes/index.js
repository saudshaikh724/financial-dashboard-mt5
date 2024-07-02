import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../../Pages/Dashbaord";
import ComingSoonPage from "../../Pages/ComingSoonPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/performance" element={<ComingSoonPage />}></Route>
      <Route path="/deposit" element={<ComingSoonPage />}></Route>
      <Route path="/history" element={<ComingSoonPage />}></Route>
      <Route path="/transfer" element={<ComingSoonPage />}></Route>
      <Route path="/withdrawal" element={<ComingSoonPage />}></Route>
      <Route path="/myreferral" element={<ComingSoonPage />}></Route>
    </Routes>
  );
}
export default AppRoutes;
