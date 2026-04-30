import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Home } from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Project from "./pages/Project";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" />
            <Route path="/projects/new" />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/profile/:username" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
