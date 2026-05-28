import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Home } from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Project from "./pages/Project";
import ProjectForm from "./pages/ProjectForm";
import ProjectEditPage from "./pages/ProjectEditPage";
import UserProfile from "./pages/UserProfile";
import DashBoard from "./pages/DashBoard";
import Layout from "./layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/projects/new" element={<ProjectForm />} />
              <Route
                path="/projects/edit/:projectId"
                element={<ProjectEditPage />}
              />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/projects/:id" element={<Project />} />
            <Route path="/users/:username" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
