import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/landingPage";
import Register from "./components/register";
import { LoggedInProvider } from "./Context/LoggedInContext";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <LoggedInProvider>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </LoggedInProvider>
    </div>
  );
}

export default App;
