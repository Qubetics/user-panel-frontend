import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/landingPage";
import Register from "./components/register";
import { LoggedInProvider } from "./Context/LoggedInContext";
import { ToastContainer } from "react-toastify";
import Activity from "./components/activity";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./components/NotFound";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/register") {
      document.body.classList.add("register-page");
    } else {
      document.body.classList.remove("register-page");
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <LoggedInProvider>
        <Header />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="request-history"
            element={
              <PrivateRoute>
                <Activity />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </LoggedInProvider>
    </div>
  );
}

export default App;
