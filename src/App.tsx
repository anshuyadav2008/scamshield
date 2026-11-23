import { Suspense, lazy } from "react";
import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./appState";
import { AppShell } from "./components/Layout";

const About = lazy(() => import("./pages/About"));
const Academy = lazy(() => import("./pages/Academy"));
const Home = lazy(() => import("./pages/Home"));
const Insights = lazy(() => import("./pages/Insights"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Scanner = lazy(() => import("./pages/Scanner"));

function RoutedApp() {
  return <MotionConfig reducedMotion="user"><AppShell><Suspense fallback={<div className="route-loading" role="status">Loading ScamShield…</div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/scanner" element={<Scanner />} />
    <Route path="/insights" element={<Insights />} />
    <Route path="/academy" element={<Academy />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></AppShell></MotionConfig>;
}

export default function App() {
  return <AppStateProvider><RoutedApp /></AppStateProvider>;
}
