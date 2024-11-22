import { CartesianGrid, Label, Pie, PieChart } from "recharts";

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

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { LineChart } from "lucide-react";
import { Line } from "react-chartjs-2";
import { parse } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslation } from "react-i18next";

function Informes() {
  const { t } = useTranslation("global");
  const [pieChartData, setPieChartData] = useState(null);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [monthYear, setMonthYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // Nuevo estado para el mes seleccionado
  const [selectedYear, setSelectedYear] = useState("2024"); // Estado para el año seleccionado

  useEffect(() => {
    document.title = `${t("dashboard.navbar.informes")} | GuateCare`;
  }, [t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        let totalNinos = 0;
        let totalNinas = 0;

        // Define el mes y año actuales si no están seleccionados
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Usa el mes y año seleccionados (o los valores actuales si no están seleccionados)
        const selectedMonthIndex = selectedMonth
          ? new Date(`${selectedMonth} 1, 2024`).getMonth() // Convierte el mes seleccionado en un índice
          : currentMonth;

        const selectedYearValue = selectedYear
          ? parseInt(selectedYear, 10)
          : currentYear;
        // Filtra y cuenta niños y niñas del mes y año seleccionados
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let fecha = null;

          if (data.createdAt) {
            fecha =
              typeof data.createdAt === "string"
                ? new Date(Date.parse(data.createdAt))
                : data.createdAt.toDate();
          }

          if (
            fecha &&
            fecha.getMonth() === selectedMonthIndex &&
            fecha.getFullYear() === selectedYearValue
          ) {
            if (data.genero === true) {
              totalNinos += 1;
            } else if (data.genero === false) {
              totalNinas += 1;
            }
          }
        });
        const total = totalNinos + totalNinas;
        setTotalVisitors(total);
        if (total > 0) {
          setPieChartData([
            { name: "Niños", value: totalNinos, fill: "#0066FF" },
            { name: "Niñas", value: totalNinas, fill: "#FFB6C1" },
          ]);
        } else {
          // console.warn("No se encontraron registros de niños o niñas.");
          setPieChartData([]);
        }
        const monthNames = [
          t("dashboard.informes.enero"),
          t("dashboard.informes.febrero"),
          t("dashboard.informes.marzo"),
          t("dashboard.informes.abril"),
          t("dashboard.informes.mayo"),
          t("dashboard.informes.junio"),
          t("dashboard.informes.julio"),
          t("dashboard.informes.agosto"),
          t("dashboard.informes.septiembre"),
          t("dashboard.informes.octubre"),
          t("dashboard.informes.noviembre"),
          t("dashboard.informes.diciembre"),
        ];
        setMonthYear(`${monthNames[selectedMonthIndex]} ${selectedYearValue}`);
      } catch (error) {
        // console.error("Error al obtener los datos de Firebase:", error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]); // Dependemos de los filtros de mes y año

  // Distribución por Comunidad Lingüística
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        const comunidadCounts = {};

        querySnapshot.forEach((doc) => {
          const { comunidadLinguistica } = doc.data();
          if (comunidadLinguistica) {
            comunidadCounts[comunidadLinguistica] =
              (comunidadCounts[comunidadLinguistica] || 0) + 1;
          }
        });

        const formattedData = Object.entries(comunidadCounts).map(
          ([name, value]) => ({ name, value })
        );

        setBarChartData(formattedData);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Crecimiento Longitudinal
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "measurements"));
        const data = [];

        querySnapshot.forEach((doc) => {
          const { longitud_cm, timestamp } = doc.data();
          if (longitud_cm && timestamp) {
            const fecha =
              typeof timestamp === "string"
                ? new Date(Date.parse(timestamp))
                : timestamp.toDate();

            data.push({
              fecha: fecha.toLocaleDateString(),
              longitud: longitud_cm,
            });
          }
        });

        // Ordenar por fecha
        const sortedData = data.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        setLineChartData(sortedData);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Frecuencia de Signos de Desnutrición Aguda
  const [signosData, setSignosData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reportes"));
        const signosCounts = {};

        querySnapshot.forEach((doc) => {
          const { signosDesnutricionAguda } = doc.data();
          if (Array.isArray(signosDesnutricionAguda)) {
            signosDesnutricionAguda.forEach((signo) => {
              signosCounts[signo] = (signosCounts[signo] || 0) + 1;
            });
          }
        });

        const formattedData = Object.entries(signosCounts).map(
          ([name, value]) => ({ name, value })
        );

        setSignosData(formattedData);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //Distribución de Género por Comunidad Lingüística
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        const comunidadData = {};

        querySnapshot.forEach((doc) => {
          const { comunidadLinguistica, genero } = doc.data();
          if (comunidadLinguistica) {
            if (!comunidadData[comunidadLinguistica]) {
              comunidadData[comunidadLinguistica] = { niños: 0, niñas: 0 };
            }
            if (genero === true) {
              comunidadData[comunidadLinguistica].niños += 1;
            } else if (genero === false) {
              comunidadData[comunidadLinguistica].niñas += 1;
            }
          }
        });

        const formattedData = Object.entries(comunidadData).map(
          ([name, counts]) => ({
            name,
            niños: counts.niños,
            niñas: counts.niñas,
          })
        );

        setData(formattedData);
      } catch (error) {
        // console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  //Evolución del Peso Promedio Mensual
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "measurements"));
        const monthlyData = {};

        querySnapshot.forEach((doc) => {
          const { peso_lb, timestamp } = doc.data();
          if (peso_lb && timestamp) {
            const fecha =
              typeof timestamp === "string"
                ? new Date(Date.parse(timestamp))
                : timestamp.toDate();
            const monthYear = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = { totalPeso: 0, count: 0 };
            }
            monthlyData[monthYear].totalPeso += peso_lb;
            monthlyData[monthYear].count += 1;
          }
        });

        const formattedData = Object.entries(monthlyData).map(
          ([monthYear, { totalPeso, count }]) => ({
            monthYear,
            pesoPromedio: totalPeso / count,
          })
        );

        setData2(formattedData); // Usamos setData2 aquí
      } catch (error) {
        // console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  //Alertas
  const [data3, setData3] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "alerta"));
        const monthlyData = {};

        querySnapshot.forEach((doc) => {
          const { timestamp } = doc.data();

          if (timestamp) {
            // Convertir la cadena de texto en un objeto Date
            const fecha = parse(
              timestamp,
              "dd/MM/yyyy, hh:mm a", // Formato del timestamp en tu colección
              new Date(),
              { locale: es } // Asegurarnos de usar el formato de español
            );

            if (isNaN(fecha)) {
              console.error("Fecha no válida:", timestamp);
              return;
            }

            // Formatear como "Mes/Año"
            const monthYear = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

            // Incrementar el conteo de alertas para ese mes
            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = 0;
            }
            monthlyData[monthYear] += 1;
          }
        });

        // Formatear los datos para usar en la gráfica
        const formattedData = Object.entries(monthlyData).map(
          ([monthYear, count]) => ({
            monthYear,
            alertas: count,
          })
        );

        // Ordenar los datos por fecha
        formattedData.sort((a, b) => {
          const [monthA, yearA] = a.monthYear.split("/").map(Number);
          const [monthB, yearB] = b.monthYear.split("/").map(Number);
          return yearA === yearB ? monthA - monthB : yearA - yearB;
        });

        setData3(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos de alertas:", error);
      }
    };

    fetchData();
  }, []);

  const [data4, setData4] = useState([]); // Reemplazamos data y setData por data4 y setData4

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        const communityData = {};

        querySnapshot.forEach((doc) => {
          const { comunidadLinguistica } = doc.data();
          if (comunidadLinguistica) {
            if (!communityData[comunidadLinguistica]) {
              communityData[comunidadLinguistica] = 0;
            }
            communityData[comunidadLinguistica] += 1;
          }
        });

        const formattedData = Object.entries(communityData).map(
          ([name, value]) => ({ name, value })
        );

        setData4(formattedData); // Usamos setData4 para actualizar el estado
      } catch (error) {
        // console.error(
        //   "Error al obtener los datos de bebés por comunidad:",
        //   error
        // );
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  const [data5, setData5] = useState([]); // Reemplazamos data y setData por data5 y setData5

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "measurements"));
        const monthlyData = {};

        querySnapshot.forEach((doc) => {
          const { longitud_cm, timestamp } = doc.data();
          if (timestamp && longitud_cm) {
            const fecha = new Date(timestamp.seconds * 1000);
            const monthYear = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = { total: 0, count: 0 };
            }
            monthlyData[monthYear].total += longitud_cm;
            monthlyData[monthYear].count += 1;
          }
        });

        const formattedData = Object.entries(monthlyData).map(
          ([monthYear, { total, count }]) => ({
            monthYear,
            avgLongitud: total / count,
          })
        );

        formattedData.sort((a, b) => {
          const [monthA, yearA] = a.monthYear.split("/").map(Number);
          const [monthB, yearB] = b.monthYear.split("/").map(Number);
          return yearA === yearB ? monthA - monthB : yearA - yearB;
        });

        setData5(formattedData); // Usamos setData5 para actualizar el estado con los datos procesados
      } catch (error) {
        // console.error(
        //   "Error al obtener los datos de longitud promedio:",
        //   error
        // );
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("dashboard.informes.title")}
        </h2>
        <p className="mt-2 mr-2 text-lg/4 ">
        {t("dashboard.informes.description")}
        </p>
      </div>
      <div className="flex flex-wrap justify-center mb-4 mx-14">
        {" "}
        {/* Chart1 */}
        <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-1/2 xl:w-1/3 2xl:w-1/4 shadow-lg rounded-lg">
          <CardHeader className="items-center pb-4">
            <CardTitle> {t("dashboard.informes.total1")}</CardTitle>
            <div className="flex flex-wrap gap-4 w-full justify-between">
              {/* Selector de mes */}
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor="mes" className="block">
                  {t("dashboard.informes.month")}
                </Label>
                <Select
                  id="mes"
                  name="mes"
                  onValueChange={(value) => setSelectedMonth(value)}
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
              {/* Selector de año */}
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor="anio" className="block">
                {t("dashboard.informes.year")}
                </Label>
                <Select
                  id="anio"
                  name="anio"
                  onValueChange={(value) => setSelectedYear(value)}
                  value={selectedYear}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription className="mt-4 text-center">
              {selectedMonth
                ? `${
                    selectedMonth.charAt(0).toUpperCase() +
                    selectedMonth.slice(1)
                  } ${selectedYear}`
                : monthYear}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pb-4">
            {pieChartData === null ? (
              <p> {t("dashboard.informes.loading")}</p>
            ) : pieChartData.length === 0 ? (
              <p> {t("dashboard.informes.empty")}</p>
            ) : (
              <PieChart
                width={200}
                height={200}
                className="aspect-square max-w-full max-h-[200px]"
              >
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
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
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalVisitors}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              {t("dashboard.informes.total")}
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium">
            {t("dashboard.informes.display")}{" "}
              {selectedMonth
                ? `${
                    selectedMonth.charAt(0).toUpperCase() +
                    selectedMonth.slice(1)
                  } ${selectedYear}`
                : monthYear}
            </div>
            <div className="text-muted-foreground">
            {t("dashboard.informes.total2")}
            </div>
          </CardFooter>
        </Card>
        {/*Chart 2 */}
        {/* COMUNIDADES */}
        <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-2/3 xl:w-1/2 2xl:w-1/3 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>{t("dashboard.informes.total3")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {barChartData.length > 0 ? (
              <BarChart
                width={300}
                height={250}
                data={barChartData}
                className="max-w-full aspect-video"
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" fill="#82ca9d" radius={[10, 10, 0, 0]} />
              </BarChart>
            ) : (
              <p className="text-center text-muted-foreground">
                {t("dashboard.informes.loading")}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Chart 3 */}
        <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-2/3 xl:w-1/2 2xl:w-1/3 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>{t("dashboard.informes.total4")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {signosData.length > 0 ? (
              <BarChart
                width={300}
                height={250}
                data={signosData}
                className="max-w-full aspect-video"
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" fill="#ff6666" radius={[10, 10, 0, 0]} />
              </BarChart>
            ) : (
              <p className="text-center text-muted-foreground">
               {t("dashboard.informes.loading")}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Chart4 */}
        <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-2/3 xl:w-1/2 2xl:w-1/3 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>
            {t("dashboard.informes.total5")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {data.length > 0 ? (
              <BarChart
                width={300}
                height={250}
                data={data}
                className="max-w-full aspect-video"
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="niños" fill="#0066FF" radius={[10, 10, 0, 0]} />
                <Bar dataKey="niñas" fill="#FFB6C1" radius={[10, 10, 0, 0]} />
              </BarChart>
            ) : (
              <p className="text-center text-muted-foreground">
                 {t("dashboard.informes.loading")}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Chart5 */}
        <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-2/3 xl:w-1/2 2xl:w-1/3 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>{t("dashboard.informes.total6")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {data3.length > 0 ? (
              <BarChart
                width={300}
                height={250}
                data={data3}
                className="max-w-full aspect-video"
              >
                <XAxis
                  dataKey="monthYear"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={false} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey={t("dashboard.informes.alerts")} fill="#FF5733" radius={[10, 10, 0, 0]} />
              </BarChart>
            ) : (
              <p className="text-center text-muted-foreground">
                 {t("dashboard.informes.loading")}
              </p>
            )}
          </CardContent>
        </Card>
        {/* Chart6 */}
        {/* <Card className="flex flex-col m-4 p-4 w-full max-w-md lg:w-2/3 xl:w-1/2 2xl:w-1/3 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle>Bebés por Comunidad Lingüística</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
            {data4.length > 0 ? (
              <PieChart width={300} height={300} className="max-w-full">
                <Pie
                  data={data4}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {data4.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  align="center" // Centra el texto en el mobile
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: 12,
                    textAlign: "center", // Asegura que el texto de los legendas también esté centrado
                  }}
                />
              </PieChart>
            ) : (
              <p className="text-center text-muted-foreground">
                Cargando datos...
              </p>
            )}
          </CardContent>
        </Card> */}
        {/* Longitud Promedio por Mes */}
        {/*  */}
      </div>
    </>
  );
}
export default Informes;
