import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Botones de ShadCN UI
import { Link } from "react-router-dom"; // Usar Link de react-router-dom
import { db } from "@/firebase"; // Firebase configuration
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firebase operations
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // ShadCN UI alert components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Componentes de tabla de ShadCN
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ShadCN UI Select
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // ShadCN UI Alert Dialog
import Spinner from "@/components/_partials/Spinner";
import { useTranslation } from "react-i18next";

export default function AlertasN() {
  const { t } = useTranslation("global");
  const [alerts, setAlerts] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    prioridad: "",
    estado: "",
    mes: "",
    año: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog de advertencia
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // Dialog de confirmación
  const [alertIdToResolve, setAlertIdToResolve] = useState(null); // Alerta que se desea resolver
  const [showDeleteButton, setShowDeleteButton] = useState(true); // Controlar visibilidad del botón para eliminar todas las alertas

  useEffect(() => {
    document.title = `${t("dashboard.navbar.alertas")} | GuateCare`;
  }, [t]);

  // Fetch alerts from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshotAlertas = await getDocs(collection(db, "alerta"));
        const alertsList = querySnapshotAlertas.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlerts(alertsList);

        // Fetch reportes (para poder obtener prioridad y estado)
        const querySnapshotReportes = await getDocs(collection(db, "reportes"));
        const reportesList = querySnapshotReportes.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReportes(reportesList);
      } catch (error) {
        // console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle marking an alert as resolved and removing it from Firestore
  const handleResolve = async () => {
    if (alertIdToResolve) {
      try {
        const alertRef = doc(db, "alerta", alertIdToResolve);
        await deleteDoc(alertRef); // Eliminar la alerta completamente de Firestore
        setAlerts((prev) =>
          prev.filter((alert) => alert.id !== alertIdToResolve)
        ); // Eliminamos de la tabla
        setIsConfirmDialogOpen(false); // Cerrar el diálogo de confirmación después de eliminar
      } catch (error) {
        // console.error("Error al resolver la alerta: ", error);
      }
    }
  };

  // Convertir la fecha en formato de cadena "11/11/2024, 02:17 PM" a un objeto Date
  const formatDate = (timestamp) => {
    if (!timestamp) return null;

    // Separar la fecha y hora
    const [datePart, timePart] = timestamp.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);

    // Parsear la hora y convertir a formato 24 horas si es necesario
    let [time, meridian] = timePart.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian === "PM" && hours < 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    // Crear el objeto Date
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Obtener los datos de prioridad y estado del reporte correspondiente
  const getPrioridadYEstado = (alertId) => {
    const reporte = reportes.find((reporte) => reporte.id === alertId);
    if (reporte) {
      return {
        prioridad: reporte.prioridad || "Aún no se cuentan con ellos",
        estado: reporte.estado || "Aún no se cuentan con ellos",
      };
    }
    return {
      prioridad: "Aún no se cuentan con ellos",
      estado: "Aún no se cuentan con ellos",
    };
  };

  // Función para obtener la clase de color según la prioridad
  const getPriorityClass = (prioridad) => {
    switch (prioridad) {
      case "Caso bajo":
        return "bg-green-500";
      case "Caso moderado":
        return "bg-orange-500";
      case "Caso alto":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Función para obtener la clase de color según el estado
  const getStateClass = (estado) => {
    switch (estado) {
      case "Caso nuevo":
        return "bg-gray-400"; // Gris claro
      case "Caso en progreso":
        return "bg-blue-600"; // Azul
      case "Caso en revisión":
        return "bg-yellow-500"; // Amarillo claro
      case "Caso resuelto":
        return "bg-green-500"; // Verde
      default:
        return "bg-gray-400"; // Gris por defecto
    }
  };

  // Filtrar alertas basadas en prioridad, estado o fecha (mes y año)
  const filteredAlerts = alerts.filter((alert) => {
    const { prioridad, estado } = getPrioridadYEstado(alert.id);
    const alertDate = formatDate(alert.timestamp);
    const matchesPrioridad =
      filter.prioridad === "" || prioridad === filter.prioridad;
    const matchesEstado = filter.estado === "" || estado === filter.estado;

    // Filtrar por mes y año
    const matchesFecha =
      (filter.mes === "" ||
        (alertDate && alertDate.getMonth() + 1 === parseInt(filter.mes))) &&
      (filter.año === "" ||
        (alertDate && alertDate.getFullYear() === parseInt(filter.año)));

    return matchesPrioridad && matchesEstado && matchesFecha;
  });

  // Función para limpiar un filtro
  const clearFilter = (filterType) => {
    setFilter((prev) => ({
      ...prev,
      [filterType]: "", // Limpiar el filtro específico
    }));
  };

  // Eliminar todas las alertas
  const handleDeleteAllAlerts = async () => {
    try {
      const alertRefs = alerts.map((alert) => doc(db, "alerta", alert.id));
      await Promise.all(alertRefs.map((alertRef) => deleteDoc(alertRef))); // Eliminar todas las alertas
      setAlerts([]); // Limpiar las alertas en el estado
      setShowDeleteButton(false); // Ocultar el botón después de eliminar
    } catch (error) {
      // console.error("Error al eliminar todas las alertas: ", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("dashboard.alertas.title")}
        </h2>
        <p className="mt-2 p-6 text-lg/8">
          {t("dashboard.alertas.description")}
        </p>
      </div>

      {/* Filtros */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Filtros de la tabla */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Filtro de Prioridad */}
          <Select
            value={filter.prioridad}
            onValueChange={(value) =>
              setFilter({ ...filter, prioridad: value })
            }
          >
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder={t("dashboard.alertas.priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("dashboard.alertas.priority")}</SelectLabel>
                <SelectItem value="Caso bajo">
                  {t("dashboard.alertas.prioritys.mild")}
                </SelectItem>
                <SelectItem value="Caso moderado">
                  {t("dashboard.alertas.prioritys.moderate")}
                </SelectItem>
                <SelectItem value="Caso alto">
                  {t("dashboard.alertas.prioritys.severe")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtro de Estado */}
          <Select
            value={filter.estado}
            onValueChange={(value) => setFilter({ ...filter, estado: value })}
          >
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder={t("dashboard.alertas.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("dashboard.alertas.status")}</SelectLabel>
                <SelectItem value="Nuevo">
                  {t("dashboard.alertas.statuss.new")}
                </SelectItem>
                <SelectItem value="En progreso">
                  {t("dashboard.alertas.statuss.inProgress")}
                </SelectItem>
                <SelectItem value="En revisión">
                  {t("dashboard.alertas.statuss.inReview")}
                </SelectItem>
                <SelectItem value="Resuelto">
                  {t("dashboard.alertas.statuss.resolved")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtro de Mes */}
          <Select
            value={filter.mes}
            onValueChange={(value) => setFilter({ ...filter, mes: value })}
          >
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("dashboard.database.month")}</SelectLabel>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtro de Año */}
          <Select
            value={filter.año}
            onValueChange={(value) => setFilter({ ...filter, año: value })}
          >
            <SelectTrigger className="w-[180px] sm:w-[220px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("dashboard.database.year")}</SelectLabel>
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Limpiar filtros */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <Button variant="outline" onClick={() => clearFilter("prioridad")}>
            {t("dashboard.alertas.cleanp")}
          </Button>
          <Button variant="outline" onClick={() => clearFilter("estado")}>
            {t("dashboard.alertas.cleans")}
          </Button>
          <Button variant="outline" onClick={() => clearFilter("mes")}>
            {t("dashboard.alertas.cleanm")}
          </Button>
          <Button variant="outline" onClick={() => clearFilter("año")}>
            {t("dashboard.alertas.cleany")}
          </Button>
        </div>

        {/* Botón para eliminar todas las alertas */}
        {/* {showDeleteButton && (
          <div className="mt-6 text-center">
            <Button variant="destructive" onClick={handleDeleteAllAlerts}>
              Eliminar todas las alertas
            </Button>
          </div>
        )} */}
      </div>

      {/* Tabla */}
      <div className="py-4 px-6">
        <div className="w-full max-w-6xl mx-auto border border-gray-300 dark:border-zinc-900 rounded-lg overflow-hidden">
          {/* Contenedor para el scrollbar */}
          <div
            className={`overflow-y-auto ${
              filteredAlerts.length > 20 ? "max-h-96" : ""
            }`}
          >
            <Table className="w-full border-separate">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-gray-200 text-gray-700 dark:bg-zinc-900 dark:text-white">
                    {t("dashboard.alertas.date")}
                  </TableHead>
                  <TableHead className="bg-gray-200 text-gray-700 dark:bg-zinc-900 dark:text-white">
                    {t("dashboard.alertas.priority")}
                  </TableHead>
                  <TableHead className="bg-gray-200 text-gray-700 dark:bg-zinc-900 dark:text-white">
                    {t("dashboard.alertas.status")}
                  </TableHead>
                  <TableHead className="bg-gray-200 text-gray-700 dark:bg-zinc-900 dark:text-white">
                    {t("dashboard.database.id")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-900 dark:text-white">
                    {t("dashboard.alertas.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted py-4"
                    >
                      {t("dashboard.alertas.none")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => {
                    const { prioridad, estado } = getPrioridadYEstado(alert.id);

                    return (
                      <TableRow
                        key={alert.id}
                        className="hover:bg-gray-50 dark:hover:bg-zinc-900"
                      >
                        <TableCell className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                          {formatDate(alert.timestamp)?.toLocaleString()}
                        </TableCell>
                        <TableCell className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                          <span
                            className={`inline-block w-2 h-2 mx-2 rounded-full ${getPriorityClass(
                              prioridad
                            )}`}
                          ></span>
                          {prioridad}
                        </TableCell>
                        <TableCell className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                          <span
                            className={`inline-block w-2 h-2 mx-2 rounded-full ${getStateClass(
                              estado
                            )}`}
                          ></span>
                          {estado}
                        </TableCell>
                        <TableCell className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                          {alert.id}
                        </TableCell>
                        <TableCell className="border-t border-gray-200 dark:border-gray-700 text-right px-4 py-2">
                          <div className="flex gap-2 justify-end">
                            <Link to={`/Panel/Reportes/${alert.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-700 dark:text-white"
                              >
                                {t("dashboard.alertas.editr")}
                              </Button>
                            </Link>

                            {/* Botón Resuelto */}
                            <AlertDialog
                              open={isDialogOpen}
                              onOpenChange={setIsDialogOpen}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  style={{
                                    backgroundColor: "#00A36C",
                                    color: "white",
                                  }}
                                  size="sm"
                                  onClick={() => {
                                    setAlertIdToResolve(alert.id);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  {t("dashboard.alertas.statuss.resolved")}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {t("dashboard.alertas.title2")}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("dashboard.alertas.desc2")}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {t("dashboard.database.cancel")}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      setIsDialogOpen(false);
                                      setIsConfirmDialogOpen(true);
                                    }}
                                  >
                                    {t("dashboard.alertas.continues")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {/* Botón rojo para eliminar alerta */}
                            <AlertDialog
                              open={isConfirmDialogOpen}
                              onOpenChange={setIsConfirmDialogOpen}
                            >
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {t("dashboard.alertas.confirm")}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("dashboard.alertas.desc3")}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleResolve}>
                                    {t("dashboard.alertas.confirm2")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="min-h-screen"></div>
    </>
  );
}
