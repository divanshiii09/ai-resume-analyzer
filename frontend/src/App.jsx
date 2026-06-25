import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Analysis from "./pages/Analysis";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
return ( <BrowserRouter> <Routes>

    <Route
      path="/"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/upload"
      element={
        <ProtectedRoute>
          <UploadResume />
        </ProtectedRoute>
      }
    />

    <Route
      path="/analysis"
      element={
        <ProtectedRoute>
          <Analysis />
        </ProtectedRoute>
      }
    />

  </Routes>
</BrowserRouter>


);
}

export default App;
