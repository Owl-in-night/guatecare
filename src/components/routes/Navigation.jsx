import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Main Pages
import Home from "../../pages/Home";
import DashboardI from "@/pages/DashboardI";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
//Page Support
import Support from "../../pages/Support";
import Aboutus from "../../pages/support/aboutus";
import HistoryA from "../../pages/support/history";
import GalleryA from "@/pages/support/gallery";
import Map from "@/pages/support/map";
import Donar from "@/pages/support/donar";
import UserManual from "@/pages/support/manual";
import ContactUs from "@/pages/support/contact";
import Community from "@/pages/support/community";
import Createditar from "@/pages/support/createdit";
import ProblemSupport from "@/pages/support/problems";
//Error
import Error from "../_partials/Error";

//AuthContext
import { AuthProvider } from "@/context/authContext";
import { ProtectedRoute } from "../_partials/Protectedroute";
//Scrolltop
import ScrollToTop from "../_partials/ScrollToTop";

import Dashboard from "../../pages/Dashboard";
// import System from "./System";


function Navigation() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Marcar como terminado el proceso de carga
  }, [location.pathname]);

  if (loading) return null; // Mostrar un estado de carga o null mientras se procesa el idioma

  return (
    <div className="Navigation">
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Estadísticas" element={<DashboardI />} />
          <Route path="/Acceder" element={<SignIn />} />
          <Route path="/Registrese" element={<SignUp />} />
          <Route
            path="/Panel/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* System
          <Route
            path="/Panel/*"
            element={
              <ProtectedRoute>
                <System />
              </ProtectedRoute>
            }
          /> */}
          {/* Soporte */}
          <Route path="/Soporte" element={<Support />} />
          <Route path="/Soporte/Sobre-Nosotros" element={<Aboutus />} />
          <Route path="/Soporte/Historia" element={<HistoryA />} />
          <Route path="/Soporte/Fotos" element={<GalleryA />} />
          <Route path="/Soporte/Mapa" element={<Map />} />
          <Route path="/Soporte/Donar" element={<Donar />} />
          <Route path="/Soporte/Manual" element={<UserManual />} />
          <Route path="/Soporte/Contacto" element={<ContactUs />} />
          <Route path="/Soporte/Comunidad" element={<Community />} />
          <Route path="/Soporte/Crear-Editar" element={<Createditar />} />
          <Route path="/Soporte/Problemas" element={<ProblemSupport />} />
          {/* Añade más rutas si es necesario */}
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Navigation;
