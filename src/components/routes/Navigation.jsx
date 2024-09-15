import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Main Pages
import Home from "../../pages/Home";
import DashboardI from "@/pages/DashboardI";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import Support from "../../pages/Support";
//Page Support
import Aboutus from "../../pages/support/aboutus";
import HistoryA from "../../pages/support/history";
import GalleryA from "@/pages/support/gallery";
import Map from "@/pages/support/map";
import Donar from "@/pages/support/donar";
import UserManual from "@/pages/support/manual";
import ContactUs from "@/pages/support/contact";
import Community from "@/pages/support/community";
//Error
import Error from "../_partials/Error";


//AuthContext
import { AuthProvider } from "@/context/authContext";
import { ProtectedRoute } from "../_partials/Protectedroute";
//Scrolltop
import ScrollToTop from "../_partials/ScrollToTop";

import Dashboard from "../../pages/Dashboard";

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
          <Route path="/Panel-Inicial" element={<DashboardI />} />
          <Route path="/Acceder" element={<SignIn />} />
          <Route path="/Registrese" element={<SignUp />} />
          <Route path="/Soporte" element={<Support />} />
          <Route path="/Soporte/Sobre-Nosotros" element={<Aboutus />} />
          <Route path="/Soporte/Historia" element={<HistoryA />} />
          <Route path="/Soporte/Fotos" element={<GalleryA />} />
          <Route path="/Soporte/Mapa" element={<Map />} />
          <Route path="/Soporte/Donar" element={<Donar />} />
          <Route path="/Soporte/Manual" element={<UserManual />} />
          <Route path="/Soporte/Contacto" element={<ContactUs />} />
          <Route path="/Soporte/Comunidad" element={<Community />} />
          <Route path="/Panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Añade más rutas si es necesario */}
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Navigation;
