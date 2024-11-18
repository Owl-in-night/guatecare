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

export default function AlertasN() {
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
        console.error("Error fetching data: ", error);
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
        console.error("Error al resolver la alerta: ", error);
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
      case "Baja":
        return "bg-green-500";
      case "Moderada":
        return "bg-orange-500";
      case "Alta":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Función para obtener la clase de color según el estado
  const getStateClass = (estado) => {
    switch (estado) {
      case "Nuevo":
        return "bg-gray-400"; // Gris claro
      case "En progreso":
        return "bg-blue-600"; // Azul
      case "En revisión":
        return "bg-yellow-500"; // Amarillo claro
      case "Resuelto":
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
      console.error("Error al eliminar todas las alertas: ", error);
    }
  };

  if (loading) {
    return (
      <Spinner/>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Alertas
        </h2>
        <p className="mt-2 text-lg/8">
          Visualice de manera clara la fecha, la prioridad, el estado y las acciones disponibles para gestionar las alertas.
        </p>
      </div>

      {/* Filtros */}
      <div className="max-w-2xl mx-auto p-4">
        {/* Filtros de la tabla */}
        <div className="flex gap-4 justify-center">
          {/* Filtro de Prioridad */}
          <Select
            value={filter.prioridad}
            onValueChange={(value) =>
              setFilter({ ...filter, prioridad: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Prioridad</SelectLabel>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Moderada">Moderada</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtro de Estado */}
          <Select
            value={filter.estado}
            onValueChange={(value) => setFilter({ ...filter, estado: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estado</SelectLabel>
                <SelectItem value="Nuevo">Nuevo</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="En revisión">En revisión</SelectItem>
                <SelectItem value="Resuelto">Resuelto</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Filtros de Mes y Año */}
          <Select
            value={filter.mes}
            onValueChange={(value) => setFilter({ ...filter, mes: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Mes</SelectLabel>
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

          {/* Año */}
          <Select
            value={filter.año}
            onValueChange={(value) => setFilter({ ...filter, año: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Año</SelectLabel>
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
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" onClick={() => clearFilter("prioridad")}>
            Limpiar Prioridad
          </Button>
          <Button variant="outline" onClick={() => clearFilter("estado")}>
            Limpiar Estado
          </Button>
          <Button variant="outline" onClick={() => clearFilter("mes")}>
            Limpiar Mes
          </Button>
          <Button variant="outline" onClick={() => clearFilter("año")}>
            Limpiar Año
          </Button>
        </div>

        {/* Botón para eliminar todas las alertas */}
        {showDeleteButton && (
          <div className="mt-6 text-center">
            <Button variant="destructive" onClick={handleDeleteAllAlerts}>
              Eliminar todas las alertas
            </Button>
          </div>
        )}
      </div>

      <Table className="py-4 w-full max-w-6xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAlerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted py-4">
                No hay alertas.
              </TableCell>
            </TableRow>
          ) : (
            filteredAlerts.map((alert) => {
              const { prioridad, estado } = getPrioridadYEstado(alert.id);

              return (
                <TableRow key={alert.id}>
                  {/* Fecha */}
                  <TableCell>
                    {formatDate(alert.timestamp)?.toLocaleString()}
                  </TableCell>
                  {/* Prioridad */}
                  <TableCell>
                    <span
                      className={`inline-block w-2 h-2 mx-2 rounded-full ${getPriorityClass(
                        prioridad
                      )}`}
                    ></span>
                    {prioridad}
                  </TableCell>
                  {/* Estado */}
                  <TableCell>
                    <span
                      className={`inline-block w-2 h-2 mx-2 rounded-full ${getStateClass(
                        estado
                      )}`}
                    ></span>
                    {estado}
                  </TableCell>
                  {/* ID de la alerta */}
                  <TableCell>{alert.id}</TableCell>
                  {/* Descripción */}
                  <TableCell>{alert.message}</TableCell>
                  {/* Acciones */}
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link to={`/Panel/Reportes/${alert.id}`}>
                        <Button variant="outline" size="sm">
                          Editar reporte
                        </Button>
                      </Link>

                      {/* Botón Resuelto (Verde) */}
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
                            Resuelto
                          </Button>
                        </AlertDialogTrigger>

                        {/* Dialogo de advertencia para el botón verde */}
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción marcará la alerta como resuelta y la
                              eliminará de la base de datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setIsDialogOpen(false);
                                setIsConfirmDialogOpen(true); // Abre el dialogo de confirmación
                              }}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Botón rojo para eliminar alerta */}
                      <AlertDialog
                        open={isConfirmDialogOpen}
                        onOpenChange={setIsConfirmDialogOpen}
                      >
                        {/* Dialogo de confirmación para el botón rojo */}
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar Eliminación
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente la alerta de
                              la base de datos. ¿Deseas continuar?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResolve}>
                              Confirmar
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

      <div className="min-h-screen"></div>
    </>
  );
}
