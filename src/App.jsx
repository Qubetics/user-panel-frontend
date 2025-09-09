import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/landingPage";
import Register from "./components/register";
import { LoggedInProvider } from "./Context/LoggedInContext";

function App() {
  return (

    <div className="min-h-screen">
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
