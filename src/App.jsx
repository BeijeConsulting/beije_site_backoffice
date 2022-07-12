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
import Blogs from "./pages/Blogs";
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import CaseStudy from "./pages/CaseStudy";
import Events from './pages/Events'
import Event from './pages/Event'

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
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/blogs/new" element={<Blog isNew />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudy />} />
            <Route path="/case-studies/new" element={<CaseStudy isNew />} />
            <Route path="/community" element={<Users />} />
            <Route path="/community/:id" element={<User />} />
            <Route path="/community/new" element={<User isNew />} />
            {/* <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/event/new" element={<Event isNew />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
