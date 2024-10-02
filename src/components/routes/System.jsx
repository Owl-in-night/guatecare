// import { useEffect, useState } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";

// //Main Pages
// import Registro from "@/pages/system/registro";
// import Mediciones from "@/pages/system/mediciones";
// //Error
// import Error from "../_partials/Error";

// //AuthContext
// import { AuthProvider } from "@/context/authContext";
// // import { ProtectedRoute } from "../_partials/Protectedroute";
// //Scrolltop
// import ScrollToTop from "../_partials/ScrollToTop";


// function System() {
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(false); // Marcar como terminado el proceso de carga
//   }, [location.pathname]);

//   if (loading) return null; // Mostrar un estado de carga o null mientras se procesa el idioma

//   return (
//     <div className="Navigation">
//       <ScrollToTop />
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<Registro />} />
//           <Route path="/Mediciones" element={<Mediciones />} />
//           {/* Añade más rutas si es necesario */}
//           <Route path="*" element={<Error />} />
//         </Routes>
//       </AuthProvider>
//     </div>
//   );
// }

// export default System;
