import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";

const lineChartConfig = {
  P3: { label: "Percentil 3", color: "#FF6D6D" }, // Rojo claro
  P15: { label: "Percentil 15", color: "#FFA726" }, // Naranja claro
  P50: { label: "Percentil 50 (Mediana)", color: "#4CAF50" }, // Verde medio
  P85: { label: "Percentil 85", color: "#42A5F5" }, // Azul claro
  P97: { label: "Percentil 97", color: "#7E57C2" }, // Púrpura
  userData: { label: "Longitud del niño", color: "#FFCA28" }, // Amarillo oscuro para destacar al usuario
};

function Informes() {
  // const totalVisitors = React.useMemo(() => {
  //   return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0);
  // }, []);
  const [pieChartData, setPieChartData] = useState(null);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [monthYear, setMonthYear] = useState("");

  //Mes piechart
  const [selectedMonth, setSelectedMonth] = useState(""); // Nuevo estado para el mes seleccionado

  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        let totalNinos = 0;
        let totalNinas = 0;

        // Define el mes y año actuales
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Nombre del mes y año para la descripción
        const monthNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        setMonthYear(`${monthNames[currentMonth]} ${currentYear}`);

        // Filtra y cuenta niños y niñas del mes actual
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let fecha = null;

          // Intenta convertir createdAt a Date
          if (data.createdAt) {
            fecha =
              typeof data.createdAt === "string"
                ? new Date(Date.parse(data.createdAt)) // Convierte la cadena a Date
                : data.createdAt.toDate(); // Si ya es Timestamp, conviértelo directamente
          }

          if (
            fecha &&
            fecha.getMonth() === currentMonth &&
            fecha.getFullYear() === currentYear
          ) {
            if (data.genero === true) {
              totalNinos += 1;
            } else if (data.genero === false) {
              totalNinas += 1;
            }
          }
        });

        // Calcula el total y define los datos del gráfico
        const total = totalNinos + totalNinas;
        setTotalVisitors(total);

        if (total > 0) {
          setPieChartData([
            { name: "Niños", value: totalNinos, fill: "#0066FF" },
            { name: "Niñas", value: totalNinas, fill: "#FFB6C1" },
          ]);
        } else {
          console.warn(
            "No se encontraron registros de niños o niñas en el mes actual."
          );
          setPieChartData([]);
        }
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        let totalNinos = 0;
        let totalNinas = 0;

        // Si no hay mes seleccionado, usamos el mes actual
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const selectedMonthIndex = selectedMonth
          ? new Date(`${selectedMonth} 1, 2024`).getMonth() // Convierte el mes seleccionado en un índice
          : currentMonth;

        // Filtra y cuenta niños y niñas del mes seleccionado
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let fecha = null;

          if (data.createdAt) {
            fecha =
              typeof data.createdAt === "string"
                ? new Date(Date.parse(data.createdAt))
                : data.createdAt.toDate(); // Si ya es Timestamp, conviértelo directamente
          }

          if (
            fecha &&
            fecha.getMonth() === selectedMonthIndex &&
            fecha.getFullYear() === currentYear
          ) {
            if (data.genero === true) {
              totalNinos += 1;
            } else if (data.genero === false) {
              totalNinas += 1;
            }
          }
        });

        // Calcula el total y define los datos del gráfico
        const total = totalNinos + totalNinas;
        setTotalVisitors(total);

        if (total > 0) {
          setPieChartData([
            { name: "Niños", value: totalNinos, fill: "#0066FF" },
            { name: "Niñas", value: totalNinas, fill: "#FFB6C1" },
          ]);
        } else {
          console.warn("No se encontraron registros de niños o niñas.");
          setPieChartData([]);
        }
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    };

    fetchData();
  }, [selectedMonth]); // Dependemos del mes seleccionado

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Informes
        </h2>
        <p className="mt-2 text-lg/8 ">
          Informes generales de los usuarios registrados
        </p>
      </div>

      <div className="flex flex-wrap justify-center mb-4 mx-14">
        {" "}
        {/* Centrado y margen */}
        {/* Pie Chart Section */}
        <Card className="flex flex-col m-2 w-1/4">
          <CardHeader className="items-center pb-0">
            <CardTitle>Total niñez registrada</CardTitle>
            <div className="space-y-2">
              <Label htmlFor="mes" className="block">
                Mes
              </Label>
              <Select
                id="mes"
                name="mes"
                onValueChange={(value) => {
                  setSelectedMonth(value); // Actualizar el mes seleccionado
                }}
                value={selectedMonth}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "enero",
                    "febrero",
                    "marzo",
                    "abril",
                    "mayo",
                    "junio",
                    "julio",
                    "agosto",
                    "septiembre",
                    "octubre",
                    "noviembre",
                    "diciembre",
                  ].map((mes) => (
                    <SelectItem key={mes} value={mes}>
                      {mes.charAt(0).toUpperCase() + mes.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {selectedMonth
                ? `${
                    selectedMonth.charAt(0).toUpperCase() +
                    selectedMonth.slice(1)
                  } 2024`
                : monthYear}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {pieChartData === null ? (
              <p>Cargando datos...</p>
            ) : pieChartData.length === 0 ? (
              <p>No hay datos para mostrar.</p>
            ) : (
              <PieChart
                width={250}
                height={250}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
                <ChartTooltip />
              </PieChart>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Mostrando datos de{" "}
              {selectedMonth
                ? `${
                    selectedMonth.charAt(0).toUpperCase() +
                    selectedMonth.slice(1)
                  } 2024`
                : monthYear}
            </div>
            <div className="leading-none text-muted-foreground">
              Total de niños y niñas registrados este mes
            </div>
          </CardFooter>
        </Card>
        {/*End Pie Chart Section */}
        {/* Line Chart Section */}
        <Card className="flex flex-col m-2 w-1/4">
          <CardHeader>
            <CardTitle>Curva de Crecimiento de Longitud</CardTitle>
            <CardDescription>Comparado con los Percentiles OMS</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig}>
              <LineChart data={lineChartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value = "") => value.slice(0, 3)}
                />
                <Tooltip cursor={{ stroke: "rgba(0, 0, 0, 0.1)" }} />

                <Line
                  dataKey="P3"
                  type="natural"
                  stroke={lineChartConfig.P3.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="P15"
                  type="natural"
                  stroke={lineChartConfig.P15.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="P50"
                  type="natural"
                  stroke={lineChartConfig.P50.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="P85"
                  type="natural"
                  stroke={lineChartConfig.P85.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="P97"
                  type="natural"
                  stroke={lineChartConfig.P97.color}
                  strokeWidth={2}
                  dot={false}
                />

                {/* Línea de los datos promedio del niño */}
                <Line
                  dataKey="userData"
                  type="natural"
                  stroke={lineChartConfig.userData.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Seguimiento del Crecimiento
            </div>
            <div className="leading-none text-muted-foreground">
              Comparación con percentiles de la OMS
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Informes;
