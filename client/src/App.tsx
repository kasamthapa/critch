import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Home } from "./pages/Home";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
