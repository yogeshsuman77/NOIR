import { Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro/Intro";
import ModeSelect from "./pages/ModeSelect/ModeSelect";
import CaseList from "./pages/CaseList/CaseList";
import BoardPage from "./pages/BoardPage/BoardPage";
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/modes" element={<ModeSelect />} />
        <Route path="/cases" element={<CaseList />} />
        <Route path="/case/:id" element={<BoardPage />} />
      </Routes>
  );
};

export default App;