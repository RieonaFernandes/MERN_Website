import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";
import { isTokenValid } from "./utils/util";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

// Update authentication check
const isAuthenticated = () => {
  return isTokenValid();
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="app-container">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/home"
                  element={
                    <>
                      <Navigation />
                      <Home />
                    </>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <>
                      <Navigation />
                      <About />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <Navigation />
                      <Profile />
                    </>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
