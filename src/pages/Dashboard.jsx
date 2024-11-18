import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//Main Pages
import Registro from "@/pages/system/registro";
import Mediciones from "./system/mediciones";
import Datos from "./system/datos";
import { SettingsA } from "./system/settings";
import AlertasN from "./system/alertas";

//Error
import Error from "@/components/_partials/Error";

//AuthContext
import { AuthProvider } from "@/context/authContext";
// import { ProtectedRoute } from "../_partials/Protectedroute";
//Scrolltop
import ScrollToTop from "@/components/_partials/ScrollToTop";

import Asidebar from "@/components/_partials/Asidebar";
import Informes from "./system/informes";

import UpdateRegistro from "./system/update";
import ReadRegistro from "./system/Read";
import ReMediciones from "./system/remediciones";
import ReportesRegistros from "./system/reportes";
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
          <Route path="//Datos" element={<Datos />} />
          <Route path="//Alertas" element={<AlertasN />} />
          {/* <Route path="//Info/:id" element={<AlertasR />} /> */}
          <Route path="//Informes" element={<Informes />} />
          <Route path="//Ajustes" element={<SettingsA />} />
          <Route path="//Editar/:id" element={<UpdateRegistro />} />
          <Route path="//Leer/:id" element={<ReadRegistro />} />
          <Route path="//Remedir/:id" element={<ReMediciones />} />
          <Route path="//Reportes/:id" element={<ReportesRegistros />} />
          {/* Añade más rutas si es necesario */}
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
