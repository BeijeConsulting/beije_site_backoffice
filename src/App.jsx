import {
  BrowserRouter,
  useLocation,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import Users from "./pages/Users";
import User from "./pages/User";

function RequireAuth() {
  const location = useLocation();
  const token = window.localStorage.getItem("tk");

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<Job />} />
            <Route path="/jobs/new" element={<Job isNew />} />
            <Route path="/community" element={<Users />} />
            <Route path="/community/:id" element={<User />} />
            <Route path="/community/new" element={<User isNew />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
