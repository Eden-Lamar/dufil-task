import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import {HeroUIProvider} from "@heroui/system";
import Home from "./pages/Home";
import AddItemsPage from "./pages/AddItemsPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SideNav from "./components/SideNav";
import { AuthProvider } from "./context/AuthContext";
import { UIStateProvider } from "./context/UIStateContext"; // Import the new context
import PrivateRoute from "./components/PrivateRoute";
import NetworkStatusAlert from "./components/NetworkStatusAlert"; 

const AppLayout = () => {
  const location = useLocation();

  // Check if the current path is NOT login or signup
  const showSidebar = location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="flex">
      {showSidebar && <SideNav />} {/* Conditionally render SideNav */}
      <div className={showSidebar ? "md:ml-16 w-full" : "w-full"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/add-items" element={<PrivateRoute element={<AddItemsPage />} />} />
        </Routes>
      </div>
      <NetworkStatusAlert />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider >
        <UIStateProvider>
          <HeroUIProvider>
            <AppLayout />
          </HeroUIProvider>
        </UIStateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
