import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Main Pages
import Registro from "@/pages/system/registro";
import Mediciones from "./system/mediciones";
import Alertas from "./system/alertas";
import { SettingsA } from "./system/settings";
//Error
import Error from "@/components/_partials/Error";

//AuthContext
import { AuthProvider } from "@/context/authContext";
// import { ProtectedRoute } from "../_partials/Protectedroute";
//Scrolltop
import ScrollToTop from "@/components/_partials/ScrollToTop";

import Asidebar from "@/components/_partials/Asidebar";
import Informes from "./system/informes";

export default function Dashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Marcar como terminado el proceso de carga
  }, [location.pathname]);

  if (loading) return null; // Mostrar un estado de carga o null mientras se procesa el idioma

  return (
    <div>
      {/* Mobile */}
      <div className="flex flex-col">
        {/* <Mobile /> */}
        <Asidebar />
      </div>
      {/* Navigation system */}
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Mediciones />} />
          <Route path="//Registro" element={<Registro />} />
          <Route path="//Alertas" element={<Alertas />} />
          <Route path="//Informes" element={<Informes />} />
          <Route path="//Ajustes" element={<SettingsA />} />
          {/* Añade más rutas si es necesario */}
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
