import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./lib/auth";
import { ThemeProvider, useTheme } from "./lib/theme";
import { AppShell } from "./components/AppShell";
import { Loader, EinsteinLoadingScreen } from "./components/Primitives";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SigmaHub from "./pages/SigmaHub";
import StudentDashboard from "./pages/StudentDashboard";
import ModuleDetail from "./pages/ModuleDetail";
import Material from "./pages/Material";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import Discussions from "./pages/Discussions";
import ThreadDetail from "./pages/ThreadDetail";
import Profile from "./pages/Profile";

import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherModeration from "./pages/TeacherModeration";
import TeacherContent from "./pages/TeacherContent";

function AuthenticatedLayout() {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const currentOutlet = useOutlet();

  if (loading) {
    return <EinsteinLoadingScreen label="Memuat sesi akun..." fullscreen={true} />;
  }

  if (!profile) {
    return <Navigate to="/masuk" replace />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(3px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex-1"
        >
          {currentOutlet}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

function TeacherLayout() {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const currentOutlet = useOutlet();

  if (loading) {
    return <EinsteinLoadingScreen label="Memuat sesi pengajar..." fullscreen={true} />;
  }

  if (!profile) {
    return <Navigate to="/masuk" replace />;
  }

  if (profile.role !== "teacher") {
    return <Navigate to="/app" replace />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex-1"
        >
          {currentOutlet}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

function ThemedToaster() {
  const { isDark } = useTheme();
  return <Toaster richColors position="top-right" theme={isDark ? "dark" : "light"} />;
}

// Standalone loading screen preview page
function LoadingScreenPreviewPage() {
  const [key, setKey] = useState(0);

  return (
    <div className="relative w-screen h-screen bg-[#070b10]">
      <EinsteinLoadingScreen
        key={key}
        fullscreen={true}
        duration={3200}
        allowSkip={true}
        onComplete={() => {
          // Stay on screen or allow replay
        }}
      />
      {/* Floating replay & exit controls */}
      <div className="fixed bottom-4 right-4 z-[10000] flex items-center gap-2">
        <button
          onClick={() => setKey((prev) => prev + 1)}
          className="rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-mono text-white hover:border-amber-400 hover:text-amber-300 transition-all shadow-lg"
        >
          Putar Ulang
        </button>
        <a
          href="/"
          className="rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 text-xs font-mono text-amber-200 hover:bg-amber-500/30 transition-all shadow-lg"
        >
          Masuk ke Web &rarr;
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          {initialLoading && (
            <motion.div
              key="app-initial-loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
              className="fixed inset-0 z-[99999]"
            >
              <EinsteinLoadingScreen
                duration={2500}
                fullscreen={true}
                allowSkip={true}
                onComplete={() => setInitialLoading(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/masuk" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loading" element={<LoadingScreenPreviewPage />} />
            <Route path="/loadingscreen" element={<LoadingScreenPreviewPage />} />

            {/* Student & Shared Authenticated Routes */}
            <Route path="/app" element={<AuthenticatedLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="hub" element={<SigmaHub />} />
              <Route path="peta" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="journey" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="modul/:moduleId" element={<ModuleDetail />} />
              <Route path="modul/:moduleId/materi" element={<Material />} />
              <Route path="materi/:moduleId" element={<Material />} />
              <Route path="modul/:moduleId/kuis" element={<Quiz />} />
              <Route path="kuis/:moduleId" element={<Quiz />} />
              <Route path="hasil-kuis/:attemptId" element={<QuizResult />} />
              <Route path="modul/:moduleId/diskusi" element={<Discussions />} />
              <Route path="hasil/:attemptId" element={<QuizResult />} />
              <Route path="discussions" element={<Discussions />} />
              <Route path="diskusi" element={<Discussions />} />
              <Route path="discussions/:threadId" element={<ThreadDetail />} />
              <Route path="diskusi/:threadId" element={<ThreadDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profil" element={<Profile />} />
            </Route>

            {/* Teacher Dedicated Routes */}
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="moderation" element={<TeacherModeration />} />
              <Route path="content" element={<TeacherContent />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ThemedToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
