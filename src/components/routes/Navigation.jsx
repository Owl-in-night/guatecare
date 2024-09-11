import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
// Idiomas soportados
const supportedLanguages = ["en", "es", "fr", "ch", "hi"];
// Mapeo de regiones a idiomas
const regionToLanguageMap = {
  US: "en",
  GT: "es",
  FR: "fr",
  IN: "hi",
  CN: "ch",
};

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathLang = location.pathname.split("/")[1];

    // Detectar la región del usuario
    const detectRegion = () => {
      fetch("https://ipapi.co/json/") // Utilizando el servicio de ipapi para obtener la ubicación
        .then((response) => response.json())
        .then((data) => {
          const userCountryCode = data.country_code; // Obtener el código del país
          const userLang = regionToLanguageMap[userCountryCode] || "es"; // Mapear a un idioma o usar 'es' por defecto

          if (!supportedLanguages.includes(pathLang)) {
            navigate(
              `/${userLang}${location.pathname.replace(`/${pathLang}`, "")}`,
              { replace: true }
            );
          } else {
            i18n.changeLanguage(pathLang);
          }

          setLoading(false); // Marcar como terminado el proceso de carga
        })
        .catch(() => {
          // En caso de error, usar 'es' como idioma por defecto
          if (!supportedLanguages.includes(pathLang)) {
            navigate(`/es${location.pathname.replace(`/${pathLang}`, "")}`, {
              replace: true,
            });
          } else {
            i18n.changeLanguage(pathLang);
          }

          setLoading(false); // Marcar como terminado el proceso de carga
        });
    };

    detectRegion();
  }, [location.pathname, i18n, navigate]);

  if (loading) return null; // Mostrar un estado de carga o null mientras se detecta la región

  return (
    <div className="Navigation">
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/:lang/" element={<Home />} />
          <Route path="/:lang/Panel-Inicial" element={<DashboardI />} />
          <Route path={`/:lang/Acceder`} element={<SignIn />} />
          <Route path={`/:lang/Registrese`} element={<SignUp />} />
          <Route path={`/:lang/Soporte`} element={<Support />} />
          <Route path={`/:lang/Soporte/Sobre-Nosotros`} element={<Aboutus />} />
          <Route path={`/:lang/Soporte/Historia`} element={<HistoryA />} />
          <Route path={`/:lang/Soporte/Fotos`} element={<GalleryA />} />
          <Route path={`/:lang/Soporte/Mapa`} element={<Map />} />
          <Route path={`/:lang/Soporte/Donar`} element={<Donar />} />
          <Route path={`/:lang/Soporte/Manual`} element={<UserManual />} />
          <Route path={`/:lang/Soporte/Contacto`} element={<ContactUs />} />
          <Route path={`/:lang/Soporte/Comunidad`} element={<Community />} />
          <Route path="/:lang/Panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Añade más rutas traducidas si es necesario */}
          {/* Error page */}
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Navigation;
