import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import Users from "./users/Users";
import Snaps from "./snaps/Snaps";
import Login from "./login/Login";
import Services from "./services/Services";
import Register from "./register/Register";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./styles/App.css";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [username, setUsername] = useState("");
  const [userAccessToken, setUserAccessToken] = useState("");

  return (
<ColorModeContext.Provider value={colorMode}>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/" element={<Login setUsername={setUsername} setUserAccessToken={setUserAccessToken} />} />
      <Route
        path="*"
        element={
          <div className="app">
            <Sidebar username={username} isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/users" element={<Users userAccessToken={userAccessToken} />} />
                <Route path="/snaps" element={<Snaps userAccessToken={userAccessToken} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services" element={<Services />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  </ThemeProvider>
</ColorModeContext.Provider>
  );
}

export default App;


