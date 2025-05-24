import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useState } from "react";
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

const AuthRedirect = () => {
  return isAuthenticated() ? <Navigate to="/home" replace /> : <AuthPage />;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<AuthRedirect />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/home"
                  element={
                    <div className="relative">
                      {/* Sidebar Navigation */}
                      <Navigation
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                      />

                      {/* Main Content */}
                      <main
                        className={`transition-all duration-300 min-h-screen ${
                          isSidebarOpen ? "md:ml-50" : "md:ml-20"
                        }`}
                      >
                        <div>
                          <Home />
                        </div>
                      </main>
                    </div>
                  }
                />
                {/* <Route
                  path="/about"
                  element={
                    <>
                      <Navigation />
                      <About />
                    </>
                  }
                /> */}
                <Route
                  path="/profile"
                  element={
                    <div className="relative">
                      {/* Sidebar Navigation */}
                      <Navigation
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                      />

                      {/* Main Content */}
                      <main
                        className={`transition-all duration-300 min-h-screen ${
                          isSidebarOpen ? "md:ml-50" : "md:ml-20"
                        }`}
                      >
                        <div>
                          <Profile />
                        </div>
                      </main>
                    </div>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
