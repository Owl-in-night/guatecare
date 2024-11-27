import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Botones de ShadCN UI
import { Link } from "react-router-dom"; // Usar Link de react-router-dom
import { flexRender } from "@tanstack/react-table"; // Asegúrate de tener instalada esta librería.
import { db } from "@/firebase"; // Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firebase operations
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
import { useTranslation } from "react-i18next";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshotAlertas = await getDocs(collection(db, "alerta"));
        const alertsList = querySnapshotAlertas.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlerts(alertsList);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return null;

    const [datePart, timePart] = timestamp.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);

    let [time, meridian] = timePart.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian === "PM" && hours < 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  };

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

  const getStateClass = (estado) => {
    switch (estado) {
      case "Caso nuevo":
        return "bg-gray-400";
      case "Caso en progreso":
        return "bg-blue-600";
      case "Caso en revisión":
        return "bg-yellow-500";
      case "Caso resuelto":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const { prioridad, estado } = getPrioridadYEstado(alert.id);
    const alertDate = formatDate(alert.timestamp);
    const matchesPrioridad =
      filter.prioridad === "" || prioridad === filter.prioridad;
    const matchesEstado = filter.estado === "" || estado === filter.estado;

    const matchesFecha =
      (filter.mes === "" ||
        (alertDate && alertDate.getMonth() + 1 === parseInt(filter.mes))) &&
      (filter.año === "" ||
        (alertDate && alertDate.getFullYear() === parseInt(filter.año)));

    return matchesPrioridad && matchesEstado && matchesFecha;
  });

  const clearFilters = () => {
    setFilter({
      prioridad: "",
      estado: "",
      mes: "",
      año: "",
    });
  };

  const [t] = useTranslation("global");

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <Select
            value={filter.prioridad}
            onValueChange={(value) =>
              setFilter({ ...filter, prioridad: value })
            }
          >
            <SelectTrigger className="w-[160px] sm:w-[180px]">
              <SelectValue placeholder={t("home.data.priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("home.data.priority")}</SelectLabel>
                <SelectItem value="Caso bajo">
                  {t("home.data.dataPriority.severe")}
                </SelectItem>
                <SelectItem value="Caso moderado">
                  {t("home.data.dataPriority.moderate")}
                </SelectItem>
                <SelectItem value="Caso alto">
                  {t("home.data.dataPriority.mild")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filter.estado}
            onValueChange={(value) => setFilter({ ...filter, estado: value })}
          >
            <SelectTrigger className="w-[160px] sm:w-[180px]">
              <SelectValue placeholder={t("home.data.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("home.data.status")}</SelectLabel>
                <SelectItem value="Caso nuevo">
                  {t("home.data.dataStatus.new")}
                </SelectItem>
                <SelectItem value="Caso en progreso">
                  {t("home.data.dataStatus.inProgress")}
                </SelectItem>
                <SelectItem value="Caso en revisión">
                  {t("home.data.dataStatus.inReview")}
                </SelectItem>
                <SelectItem value="Caso resuelto">
                  {t("home.data.dataStatus.resolved")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={clearFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {t("home.data.clean")}
          </Button>
        </div>
      </div>

      <div className="py-6 px-4">
        <div
          className={`w-full max-w-6xl mx-auto border-separate border border-gray-300 dark:border-zinc-700 rounded-lg shadow-md dark:bg-zinc-900 ${
            filteredAlerts.length > 4 ? "max-h-96 overflow-y-auto" : ""
          }`}
        >
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-200 dark:bg-zinc-700 text-zinc-700 dark:text-white">
                  {t("home.data.create")}
                </TableHead>
                <TableHead className="bg-gray-200 dark:bg-zinc-700 text-zinc-700 dark:text-white">
                  {t("home.data.priority")}
                </TableHead>
                <TableHead className="bg-gray-200 dark:bg-zinc-700 text-zinc-700 dark:text-white">
                  {t("home.data.status")}
                </TableHead>
                <TableHead className="bg-gray-200 dark:bg-zinc-700 text-zinc-700 dark:text-white">
                  {t("home.data.follow")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted py-4"
                  >
                    {t("home.data.none")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => {
                  const { prioridad, estado } = getPrioridadYEstado(alert.id);
                  const reporteRelacionado = reportes.find(
                    (reporte) => reporte.id === alert.id
                  );
                  const fechaSeguimiento = reporteRelacionado?.timestamp;

                  return (
                    <TableRow
                      key={alert.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      <TableCell className="border-t border-gray-200 dark:border-zinc-700 px-4 py-2">
                        {formatDate(alert.timestamp)?.toLocaleString()}
                      </TableCell>
                      <TableCell className="border-t border-gray-200 dark:border-zinc-700 px-4 py-2">
                        <span
                          className={`inline-block w-2 h-2 mx-2 rounded-full ${getPriorityClass(
                            prioridad
                          )}`}
                        ></span>
                        {prioridad}
                      </TableCell>
                      <TableCell className="border-t border-gray-200 dark:border-zinc-700 px-4 py-2">
                        <span
                          className={`inline-block w-2 h-2 mx-2 rounded-full ${getStateClass(
                            estado
                          )}`}
                        ></span>
                        {estado}
                      </TableCell>
                      <TableCell className="border-t border-gray-200 dark:border-zinc-700 px-4 py-2">
                        {fechaSeguimiento
                          ? new Date(
                              fechaSeguimiento.seconds * 1000
                            ).toLocaleString()
                          : "Sin seguimiento"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
