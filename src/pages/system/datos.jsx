import React, { useEffect, useState } from "react";
import { db } from "@/firebase"; // Configuración de Firebase
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
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

// Importa el toast desde Shadcn
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns"; // Importamos la librería `date-fns`
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 20;
function Datos() {
  const { t } = useTranslation("global");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("week");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { toast } = useToast(); // Inicializa el hook de toast

  useEffect(() => {
    document.title = `${t("dashboard.navbar.datos")} | GuateCare`;
  }, [t]);

  useEffect(() => {
    const savedFilter = localStorage.getItem("filter");
    if (savedFilter) {
      setFilter(savedFilter);
    }

    const fetchData = async () => {
      const dataCollection = collection(db, "bebe");
      const dataSnapshot = await getDocs(dataCollection);
      const dataList = dataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilter = () => {
      const now = new Date();
      let startDate;

      // Filtrar según el valor del filtro seleccionado
      switch (filter) {
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth()));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        // Filtrar datos que tengan `createdAt` después de `startDate`
        const filtered = data.filter((item) => {
          const createdAt = new Date(item.createdAt);
          return createdAt >= startDate;
        });
        setFilteredData(filtered);
      } else {
        setFilteredData(data); // Mostrar todos los datos si no hay filtro
      }
    };

    applyFilter();
  }, [filter, data]);

  const handleAlertDialogOpen = (id) => {
    setSelectedId(id);
    setAlertDialogOpen(true);
  };

  const handleAlert = async () => {
    if (selectedId) {
      try {
        // Obtener la fecha actual y formatearla
        const formattedDate = format(new Date(), "dd/MM/yyyy, hh:mm a");

        // Guardar la alerta en Firestore con la fecha formateada
        await setDoc(doc(db, "alerta", selectedId), {
          alertStatus: true,
          timestamp: formattedDate, // Fecha formateada como cadena
        });

        // Muestra el toast de éxito
        toast({
          variant: "destructive",
          description:
            "La alerta ha sido activada correctamente en el registro.",
          duration: 3000, // Duración en milisegundos
          position: "top-center", // Posición del toast
        });

        setAlertDialogOpen(false);
      } catch (error) {
        // console.error("Error al activar la alerta:", error);
        setAlertDialogOpen(false);
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Filtrar datos para la página actual
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Manejadores para cambiar de página
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center px-4">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("dashboard.database.title")}
        </h2>
        <p className="mt-2 text-lg/8">{t("dashboard.database.description1")}</p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(newFilter) => setFilter(newFilter)}
        className="py-4 w-full max-w-6xl mx-auto px-4"
      >
        <TabsList>
          <TabsTrigger
            value="week"
            className="p-2 mx-1  dark:text-white dark:bg-zinc-700   rounded-md"
          >
            {t("dashboard.database.week")}
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="p-2 mx-1  dark:text-white dark:bg-zinc-700  rounded-md"
          >
            {t("dashboard.database.month")}
          </TabsTrigger>
          <TabsTrigger
            value="year"
            className="p-2 mx-1  dark:text-white dark:bg-zinc-700   rounded-md"
          >
            {t("dashboard.database.year")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <div className="my-4">
            <Table className="w-full table-auto border-separate border border-gray-300 dark:border-zinc-900 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-gray-200 text-zinc-800 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.id")}
                  </TableHead>
                  <TableHead className="bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.datecreate")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.edit")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.read")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.remedy")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.report")}
                  </TableHead>
                  <TableHead className="text-right bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-white">
                    {t("dashboard.database.alert")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 px-4 py-2">
                      {item.id}
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 px-4 py-2">
                      {item.createdAt}
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 text-right px-4 py-2">
                      <Link to={`/Panel/Editar/${item.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-700 dark:text-white dark:hover:bg-zinc-600"
                        >
                          {t("dashboard.database.edit")}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 text-right px-4 py-2">
                      <Link to={`/Panel/Leer/${item.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-700 dark:text-white dark:hover:bg-zinc-600"
                        >
                          {t("dashboard.database.read")}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 text-right px-4 py-2">
                      <Link to={`/Panel/Remedir/${item.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-700 dark:text-white dark:hover:bg-zinc-600"
                        >
                          {t("dashboard.database.remedy")}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 text-right px-4 py-2">
                      <Link to={`/Panel/Reportes/${item.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-700 dark:text-white dark:hover:bg-zinc-600"
                        >
                          {t("dashboard.database.report")}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="border-t border-gray-200 dark:border-zinc-800 text-right px-4 py-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAlertDialogOpen(item.id)}
                      >
                        {t("dashboard.database.alert")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                {t("dashboard.database.previous")}
              </button>
              <span className="text-gray-700 dark:text-white">
                {t("dashboard.database.page")} {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                {t("dashboard.database.next")}
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* AlertDialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.database.title2")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.database.description3")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
              {t("dashboard.database.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAlert}>
              {t("dashboard.database.active")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Datos;
