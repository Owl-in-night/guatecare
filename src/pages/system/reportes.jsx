import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { SignosD } from "./signos"; // Asegúrate de que SignosD tiene la estructura correcta
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

function ReportesRegistros() {
  const { t } = useTranslation("global");
  const [reportes, setReportes] = useState([]);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const { id } = useParams(); // ID del bebé
  const [signosSeleccionados, setSignosSeleccionados] = useState({}); // Almacenará el estado de cada signo
  const [error, setError] = useState(""); // Estado para mostrar errores
  const [fechaUltimoSeguimiento, setFechaUltimoSeguimiento] = useState(""); // Fecha de último seguimiento
  const [horaActual, setHoraActual] = useState(""); // Hora actual para mostrarla en el label
  const [fechaActualizacion, setFechaActualizacion] = useState(""); // Fecha de actualización
  const [comentario, setComentario] = useState(""); // Comentario adicional para el reporte

  useEffect(() => {
    document.title = `${t("dashboard.navbar.reportar")} | GuateCare`;
  }, [t]);
  // Estado para controlar el AlertDialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Función para manejar la selección o deselección de un signo
  const handleSelectionChange = (signo) => {
    setSignosSeleccionados((prevState) => ({
      ...prevState,
      [signo]: !prevState[signo], // Cambiar el estado de cada signo individualmente
    }));
  };

  // Función para manejar el cambio de prioridad
  const handlePrioridadChange = (value) => {
    setReporteSeleccionado((prevState) => ({
      ...prevState,
      prioridad: value,
    }));
  };

  // Función para manejar el cambio de estado
  const handleEstadoChange = (value) => {
    setReporteSeleccionado((prevState) => ({
      ...prevState,
      estado: value,
    }));
  };

  // Función para manejar el cambio de comentario
  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  // Cargar reportes y seleccionar el reporte actual según el ID
  useEffect(() => {
    const fetchReportes = async () => {
      const reportesCollection = collection(db, "reportes");
      const reportesSnapshot = await getDocs(reportesCollection);
      const reportesList = reportesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportes(reportesList);

      const reporteEncontrado = reportesList.find(
        (reporte) => reporte.idBebe === id // Filtrar por ID del bebé
      );
      setReporteSeleccionado(reporteEncontrado);

      // Cargar datos de fecha de seguimiento y fecha de actualización
      if (reporteEncontrado && reporteEncontrado.timestamp) {
        setFechaUltimoSeguimiento(
          reporteEncontrado.timestamp.toDate().toLocaleString()
        );
        // Fecha de actualización
        setFechaActualizacion(
          reporteEncontrado.timestamp.toDate().toLocaleString()
        );
        // Cargar signos seleccionados
        const signosCargados = {};
        reporteEncontrado.signosDesnutricionAguda.forEach((signo) => {
          signosCargados[signo] = true;
        });
        setSignosSeleccionados(signosCargados);

        // Cargar el comentario si está presente en el reporte
        if (reporteEncontrado.comentario) {
          setComentario(reporteEncontrado.comentario);
        }
      }
    };

    fetchReportes();
  }, [id]);

  // Función para guardar los cambios en Firebase
  const handleGuardarCambios = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (!reporteSeleccionado.prioridad || !reporteSeleccionado.estado) {
      setError(t("errors.todo"));
      return;
    }

    // Validación de al menos un signo seleccionado
    const signosSeleccionadosArray = Object.keys(signosSeleccionados).filter(
      (key) => signosSeleccionados[key] // Solo los signos que están activos
    );
    if (signosSeleccionadosArray.length === 0) {
      setError(t("errors.todo"));
      return;
    }

    // Limpiar mensajes de error
    setError("");

    // Datos a guardar
    const reporteActualizado = {
      prioridad: reporteSeleccionado.prioridad,
      estado: reporteSeleccionado.estado,
      signosDesnutricionAguda: signosSeleccionadosArray,
      idBebe: id,
      timestamp: new Date(), // Fecha de creación/modificación
      comentario: comentario, // Comentario adicional
    };

    try {
      const reporteRef = doc(db, "reportes", id);
      await setDoc(reporteRef, reporteActualizado, { merge: true });

      // Mostrar el AlertDialog con mensaje de éxito
      setAlertMessage("Cambios guardados exitosamente.");
      setIsAlertOpen(true);
    } catch (error) {
      // console.error("Error al guardar los cambios:", error);
      setAlertMessage("Hubo un error al guardar los datos.");
      setIsAlertOpen(true);
    }
  };

  // Mostrar el botón correcto dependiendo de si el reporte existe
  const botonTexto =
    reporteSeleccionado && reporteSeleccionado.timestamp
      ? "Actualizar datos"
      : "Guardar datos";

  // Mostrar la hora actual cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setHoraActual(now.toLocaleString());
    }, 1000);

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  return (
    <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("dashboard.report.title")} {id}
        </h2>
        <p className="mt-2 text-lg">
          {fechaUltimoSeguimiento
            ? `${t("dashboard.report.lastfollow")} ${fechaUltimoSeguimiento}`
            : t("dashboard.report.none")}
        </p>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleGuardarCambios}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-4">
            <label htmlFor="prioridad" className="block text-sm font-medium">
              {t("dashboard.report.prioridad")}
            </label>
            <Select
              id="prioridad"
              name="prioridad"
              value={reporteSeleccionado?.prioridad || ""}
              onValueChange={handlePrioridadChange}
              required
            >
              <SelectTrigger className="w-full mt-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <SelectValue placeholder="Selecciona una prioridad" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "Alta", label: "Alta" },
                  { value: "Moderada", label: "Moderada" },
                  { value: "Baja", label: "Baja" },
                ].map((opcion) => (
                  <SelectItem key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label htmlFor="estado" className="block text-sm font-medium">
            {t("dashboard.report.estado")}
            </label>
            <Select
              id="estado"
              name="estado"
              value={reporteSeleccionado?.estado || ""}
              onValueChange={handleEstadoChange}
              required
            >
              <SelectTrigger className="w-full mt-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "Nuevo", label: "Nuevo" },
                  { value: "En progreso", label: "En progreso" },
                  { value: "En revisión", label: "En revisión" },
                  { value: "Resuelto", label: "Resuelto" },
                ].map((opcion) => (
                  <SelectItem key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones para los Signos de Desnutrición Aguda */}
        <div className="space-y-4 mt-6">
          <label htmlFor="signos" className="block text-sm font-medium">
          {t("dashboard.report.signos")}
          </label>
          <div className="flex flex-wrap gap-2">
            {SignosD.map((signo) => (
              <button
                key={signo.key} // Asegúrate de usar signo.key (o cualquier propiedad única)
                type="button"
                className={`px-4 py-2 rounded-md text-sm ${
                  signosSeleccionados[signo.key]
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handleSelectionChange(signo.key)}
              >
                {signo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea para comentario adicional */}
        <div className="space-y-4 mt-6">
          <Label htmlFor="comentario">{t("dashboard.report.ver")}</Label>
          <Textarea
            id="comentario"
            value={comentario}
            onChange={handleComentarioChange}
            placeholder={t("dashboard.report.signosp")}
            rows={4}
          />
        </div>

        {/* Mostrar la hora actual */}
        <div className="mt-8 text-center ">
          <p>{t("dashboard.report.hora")} {horaActual}</p>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            disabled={
              !reporteSeleccionado?.prioridad ||
              !reporteSeleccionado?.estado ||
              Object.keys(signosSeleccionados).length === 0
            } // Desactivar si el formulario no es válido
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {botonTexto}
          </button>
        </div>
      </form>

      {/* AlertDialog para mostrar el mensaje de éxito o error */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.report.pregunta")}</AlertDialogTitle>
            <AlertDialogDescription>
            {t("dashboard.report.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
            {t("dashboard.report.cerrar")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
            {t("dashboard.report.aceptar")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ReportesRegistros;
