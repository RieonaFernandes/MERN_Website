import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

function App() {
  return (
    <div className="app-container">
      <Router>
        {location.pathname !== "/" && (
          <Suspense fallback={null}>
            <Navigation />
          </Suspense>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<AuthPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
