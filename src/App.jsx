import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import GeneralLayout from "./layout/GeneralLayout";
import Community from "./screens/Community";
import Home from "./screens/Home";
import Job from "./screens/Job";
import Login from "./screens/Login";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<GeneralLayout />}>
        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="job" element={<ProtectedRoute><Job /></ProtectedRoute>} />
        <Route path="community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

function ProtectedRoute({ children }) {
  let token = localStorage.getItem('tk');

  if (!token) {
    return <Navigate to={`/login`} />
  }

  return children;
}

// function UserAuth ({children}){
  // let auth = localStorage.getItem(obj);
  // let token = ...

  // if (!auth.user || !token) {
  //   return <Navigate to={`/login`} />
  // }

  // return children;
// }