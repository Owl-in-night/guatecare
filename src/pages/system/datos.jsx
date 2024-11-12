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

function Datos() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("week");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { toast } = useToast(); // Inicializa el hook de toast

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
          description: "La alerta ha sido activada correctamente en el registro.",
          duration: 3000, // Duración en milisegundos
          position: "top-center", // Posición del toast
        });

        setAlertDialogOpen(false);
      } catch (error) {
        console.error("Error al activar la alerta:", error);
        setAlertDialogOpen(false);
      }
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Datos
        </h2>
        <p className="mt-2 text-lg/8">
          Seleccione el registro que desee Editar, Visualizar, Remedir, Crear reporte o Alertar
        </p>
      </div>

      <Tabs value={filter} onValueChange={(newFilter) => setFilter(newFilter)} className="py-4 w-full max-w-6xl mx-auto">
        <TabsList>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
          <TabsTrigger value="year">Año</TabsTrigger>
        </TabsList>
        <TabsContent value={filter}>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Datos</CardTitle>
              <CardDescription>Visualizando datos según el filtro seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead className="text-right">Editar</TableHead>
                      <TableHead className="text-right">Leer</TableHead>
                      <TableHead className="text-right">Remedir</TableHead>
                      <TableHead className="text-right">Reportes</TableHead>
                      <TableHead className="text-right">Alertar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/Panel/Editar/${item.id}`}>
                            <Button size="sm" variant="outline">Editar</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/Panel/Leer/${item.id}`}>
                            <Button size="sm" variant="outline">Leer</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/Panel/Remedir/${item.id}`}>
                            <Button size="sm" variant="outline">Remedir</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/Panel/Reportes/${item.id}`}>
                            <Button size="sm" variant="outline">Reportes</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive" onClick={() => handleAlertDialogOpen(item.id)}>
                            Alertar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AlertDialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas activar una alerta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción activará una alerta en el registro seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlert}>Activar Alerta</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Datos;
