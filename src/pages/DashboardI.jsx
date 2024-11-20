import { useEffect, useState } from "react";

//Recharts
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Rectangle,
  ReferenceLine,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase"; // Asegúrate de que tienes configurado Firebase aquí
import { Tooltip } from "react-leaflet";
import { PieChart, Pie } from "recharts";
import { Legend } from "chart.js";
import DataTable from "./datatable";
import TiemRaspberry from "./tiemraspb";
import AlertaGrafico from "./AlertaGrafico";

// Función para generar etiquetas de meses dinámicamente
const generateMonthYearLabel = (data) => {
  const months = [
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

  const labels = {};

  data.forEach((entry) => {
    const [month, year] = entry.monthYear.split("/").map(Number);
    const monthName = months[month - 1];
    labels[entry.monthYear] = `${monthName} ${year}`;
  });

  return labels;
};

// Paleta de colores
const colorPalette = [
  "var(--color-blue)",
  "var(--color-green)",
  "var(--color-orange)",
  "var(--color-red)",
  "var(--color-purple)",
  "var(--color-teal)",
  "var(--color-yellow)",
  "var(--color-cyan)",
  "var(--color-pink)",
  "var(--color-brown)",
  "var(--color-lime)",
  "var(--color-indigo)",
];

export default function DashboardI() {
  const [t] = useTranslation("global");
  //Time
  const value = 2160;

  useEffect(() => {
    document.title = `${t("navbar.stadistics")} | GuateCare`;
  }, [t]);

  const [activeAlerts, setActiveAlerts] = useState(0); // Estado para la cantidad de alertas activadas

  useEffect(() => {
    document.title = `${t("navbar.stadistics")} | GuateCare`;

    // Query para obtener alertas activadas
    const q = query(collection(db, "alerta"), where("alertStatus", "==", true));

    // Suscribirse a los cambios en la colección
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveAlerts(snapshot.size); // Actualizar el estado con la cantidad de documentos
    });

    // Limpiar suscripción
    return () => unsubscribe();
  }, [t]);

  const [maleCountThisMonth, setMaleCountThisMonth] = useState(0);
  const [femaleCountThisMonth, setFemaleCountThisMonth] = useState(0);
  const [maleCountLastMonth, setMaleCountLastMonth] = useState(0);
  const [femaleCountLastMonth, setFemaleCountLastMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bebe"));
        let maleCount = 0;
        let femaleCount = 0;
        let maleCountPrevMonth = 0;
        let femaleCountPrevMonth = 0;

        // Obtener fecha actual y mes anterior
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(currentMonth - 1); // Establece al mes anterior
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        // Recorre los documentos para contar los niños y niñas
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let fecha = null;

          if (data.createdAt) {
            // Convertir createdAt a un objeto Date
            fecha =
              typeof data.createdAt === "string"
                ? new Date(Date.parse(data.createdAt)) // Si es cadena, convertir a Date
                : data.createdAt.toDate(); // Si es un Timestamp, convertir
          }

          if (fecha) {
            const docMonth = fecha.getMonth();
            const docYear = fecha.getFullYear();

            // Contar niños y niñas del mes actual
            if (docYear === currentYear && docMonth === currentMonth) {
              if (data.genero === true) {
                maleCount += 1;
              } else if (data.genero === false) {
                femaleCount += 1;
              }
            }

            // Contar niños y niñas del mes anterior
            if (docYear === prevYear && docMonth === prevMonth) {
              if (data.genero === true) {
                maleCountPrevMonth += 1;
              } else if (data.genero === false) {
                femaleCountPrevMonth += 1;
              }
            }
          }
        });

        // Establecer los estados con los resultados
        setMaleCountThisMonth(maleCount > 0 ? maleCount : 0); // Si no hay registros, poner 0
        setFemaleCountThisMonth(femaleCount > 0 ? femaleCount : 0); // Si no hay registros, poner 0
        setMaleCountLastMonth(maleCountPrevMonth > 0 ? maleCountPrevMonth : 0); // Lo mismo para el mes anterior
        setFemaleCountLastMonth(
          femaleCountPrevMonth > 0 ? femaleCountPrevMonth : 0
        ); // Lo mismo para el mes anterior
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez al cargar el componente

  const [measurementsCountThisMonth, setMeasurementsCountThisMonth] =
    useState(0);
  const [measurementsCountLastMonth, setMeasurementsCountLastMonth] =
    useState(0);
  const [avgLengthThisMonth, setAvgLengthThisMonth] = useState(0);
  const [avgLengthLastMonth, setAvgLengthLastMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "measurements"));
        let measurementsCountCurrent = 0;
        let measurementsCountPrev = 0;
        let totalLengthCurrent = 0;
        let totalLengthPrev = 0;

        // Obtener fecha actual y mes anterior
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Mes actual
        const currentYear = currentDate.getFullYear(); // Año actual

        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(currentMonth - 1); // Fecha del mes anterior
        const prevMonth = prevMonthDate.getMonth(); // Mes anterior
        const prevYear = prevMonthDate.getFullYear(); // Año del mes anterior

        // Procesar cada documento en la colección "measurements"
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let timestamp = null;

          // Convertir el campo `timestamp` a un objeto Date
          if (data.timestamp) {
            timestamp =
              typeof data.timestamp === "string"
                ? new Date(Date.parse(data.timestamp)) // Si es cadena, convertir a Date
                : data.timestamp.toDate(); // Si es un Timestamp de Firestore
          }

          if (timestamp) {
            const docMonth = timestamp.getMonth();
            const docYear = timestamp.getFullYear();

            // Mes actual
            if (docYear === currentYear && docMonth === currentMonth) {
              measurementsCountCurrent += 1;
              totalLengthCurrent += data.longitud_cm || 0; // Sumar longitud_cm si existe
            }

            // Mes anterior
            if (docYear === prevYear && docMonth === prevMonth) {
              measurementsCountPrev += 1;
              totalLengthPrev += data.longitud_cm || 0; // Sumar longitud_cm si existe
            }
          }
        });

        // Calcular promedios
        const avgLengthCurrent = measurementsCountCurrent
          ? totalLengthCurrent / measurementsCountCurrent
          : 0;
        const avgLengthPrev = measurementsCountPrev
          ? totalLengthPrev / measurementsCountPrev
          : 0;

        // Actualizar estados
        setMeasurementsCountThisMonth(measurementsCountCurrent);
        setMeasurementsCountLastMonth(measurementsCountPrev);
        setAvgLengthThisMonth(avgLengthCurrent);
        setAvgLengthLastMonth(avgLengthPrev);
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez al cargar el componente

  const [avgWeightThisMonth, setAvgWeightThisMonth] = useState(0);
  const [avgWeightLastMonth, setAvgWeightLastMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "measurements"));
        let measurementsCountCurrent = 0;
        let measurementsCountPrev = 0;
        let totalLengthCurrent = 0;
        let totalLengthPrev = 0;
        let totalWeightCurrent = 0;
        let totalWeightPrev = 0;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(currentMonth - 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let timestamp = null;

          if (data.timestamp) {
            timestamp =
              typeof data.timestamp === "string"
                ? new Date(Date.parse(data.timestamp))
                : data.timestamp.toDate();
          }

          if (timestamp) {
            const docMonth = timestamp.getMonth();
            const docYear = timestamp.getFullYear();

            if (docYear === currentYear && docMonth === currentMonth) {
              measurementsCountCurrent += 1;
              totalLengthCurrent += data.longitud_cm || 0;
              totalWeightCurrent += data.peso_lb || 0;
            }

            if (docYear === prevYear && docMonth === prevMonth) {
              measurementsCountPrev += 1;
              totalLengthPrev += data.longitud_cm || 0;
              totalWeightPrev += data.peso_lb || 0;
            }
          }
        });

        const avgLengthCurrent = measurementsCountCurrent
          ? totalLengthCurrent / measurementsCountCurrent
          : 0;
        const avgLengthPrev = measurementsCountPrev
          ? totalLengthPrev / measurementsCountPrev
          : 0;

        const avgWeightCurrent = measurementsCountCurrent
          ? totalWeightCurrent / measurementsCountCurrent
          : 0;
        const avgWeightPrev = measurementsCountPrev
          ? totalWeightPrev / measurementsCountPrev
          : 0;

        setMeasurementsCountThisMonth(measurementsCountCurrent);
        setMeasurementsCountLastMonth(measurementsCountPrev);
        setAvgLengthThisMonth(avgLengthCurrent);
        setAvgLengthLastMonth(avgLengthPrev);
        setAvgWeightThisMonth(avgWeightCurrent);
        setAvgWeightLastMonth(avgWeightPrev);
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    };

    fetchData();
  }, []);

  //Chart
  const [data4, setData4] = useState([]);

  const chartConfig = {
    // Definir las opciones de configuración que necesitas
    // Ejemplo:
  };

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
        console.error(
          "Error al obtener los datos de bebés por comunidad:",
          error
        );
      }
    };

    fetchData();
  }, []);

  const maxCommunity =
    data4.length > 0
      ? data4.reduce((prev, current) => {
          return prev.value > current.value ? prev : current;
        })
      : { name: "No data", value: 0 }; // Valor por defecto en caso de que `data4` esté vacío

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];
  //Chart 2
  const [data3, setData3] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reportes"));
        const monthlyData = {};

        querySnapshot.forEach((doc) => {
          const { timestamp } = doc.data();
          if (timestamp) {
            const fecha = new Date(timestamp.toDate());
            const monthYear = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = 0;
            }
            monthlyData[monthYear] += 1;
          }
        });

        const formattedData = Object.entries(monthlyData).map(
          ([monthYear, count], index) => ({
            monthYear,
            reportes: count,
            fill: colorPalette[index % colorPalette.length], // Usamos la paleta de colores cíclicamente
          })
        );

        // Ordenar los datos por mes/año
        formattedData.sort((a, b) => {
          const [monthA, yearA] = a.monthYear.split("/").map(Number);
          const [monthB, yearB] = b.monthYear.split("/").map(Number);
          return yearA === yearB ? monthA - monthB : yearA - yearB;
        });

        setData3(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Generamos las etiquetas de mes/año dinámicamente a partir de los datos
  const chartConfig2 = generateMonthYearLabel(data3);

  //CHART3
  const [dataM, setDataM] = useState([]);
  const [dataH, setDataH] = useState([]);
  const [maxHour, setMaxHour] = useState({ hour: null, value: 0 });
  const [totalAlerts, setTotalAlerts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "alerta"));
        console.log("Consulta de Firestore:", querySnapshot);

        const alertasPorDia = {}; // Agrupar por día
        const alertasPorHora = {}; // Agrupar por hora

        querySnapshot.forEach((doc) => {
          const { timestamp } = doc.data();
          console.log("Timestamp del documento:", timestamp);

          // Convertir la cadena de timestamp a Date (asumimos que el timestamp es ISO 8601)
          const fecha = new Date(timestamp); // Si la cadena es un formato ISO válido, debería funcionar correctamente
          if (isNaN(fecha)) {
            console.error("Fecha no válida:", timestamp);
            return;
          }

          // Formatear fecha para el día (YYYY-MM-DD)
          const dia = fecha.toLocaleDateString("es-ES");
          // Obtener la hora (0-23)
          const hora = fecha.getHours();

          // Agrupar por día
          if (!alertasPorDia[dia]) {
            alertasPorDia[dia] = 0;
          }
          alertasPorDia[dia] += 1;

          // Agrupar por hora dentro del día
          const horaKey = `${dia} ${hora}:00`; // Ejemplo: "2024-11-13 14:00"
          if (!alertasPorHora[horaKey]) {
            alertasPorHora[horaKey] = 0;
          }
          alertasPorHora[horaKey] += 1;
        });

        console.log("Alertas por día:", alertasPorDia);
        console.log("Alertas por hora:", alertasPorHora);

        // Convertir los datos agrupados por día en formato adecuado para el gráfico
        const chartDataDay = Object.entries(alertasPorDia).map(
          ([dia, valor]) => ({
            name: dia,
            value: valor,
          })
        );
        setDataM(chartDataDay);

        // Convertir los datos agrupados por hora en formato adecuado para el gráfico
        const chartDataHour = Object.entries(alertasPorHora).map(
          ([hora, valor]) => ({
            name: hora,
            value: valor,
          })
        );
        setDataH(chartDataHour);

        // Obtener el máximo de alertas por hora
        const maxAlertHour = Object.entries(alertasPorHora).reduce(
          (prev, current) => (prev[1] > current[1] ? prev : current),
          ["", 0]
        );
        setMaxHour({ hour: maxAlertHour[0], value: maxAlertHour[1] });

        // Calcular el total de alertas por día
        const total = Object.values(alertasPorDia).reduce(
          (total, item) => total + item,
          0
        );
        setTotalAlerts(total);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="flex justify-center items-center">
            <Card className="lg:w-1/2 xl:w-auto 2xl:w-5/6 h-auto">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  {t("home.card1.text1")}
                </CardDescription>
                <CardTitle className="flex items-center">
                  <span className="text-red-500 text-6xl font-bold">
                    {activeAlerts}
                  </span>{" "}
                  <span className="ml-4">
                    {activeAlerts === 1
                      ? t("home.card1.text4") // Caso cuando hay 1 alerta
                      : t("home.card1.text3")}{" "}
                    {/* Casos cuando hay más de 1 alerta */}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeAlerts > 0 && (
                  <div className="mt-2 text-lg font-semibold text-red-600 flex items-center">
                    <span className="mr-2">🚨</span>
                    {activeAlerts > 10
                      ? t(
                          "home.card1.criticalAlert",
                          "¡Alerta crítica! Muchas alertas activadas."
                        )
                      : t(
                          "home.card1.warningAlert",
                          "¡Atención! Hay alertas activadas."
                        )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {/* Tarjeta para mostrar la cantidad de niños registrados este mes */}
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  Cantidad de niños registrados este mes
                </CardDescription>
                <CardTitle className="text-4xl">
                  <span className="text-blue-500">{maleCountThisMonth}</span>{" "}
                  niños
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  Cantidad de niños registrados el mes pasado:{" "}
                  <span className="text-blue-500">{maleCountLastMonth}</span>{" "}
                  niños
                </div>
              </CardContent>
              <CardFooter>
                {/* Puedes agregar un progreso si lo deseas */}
              </CardFooter>
            </Card>

            {/* Tarjeta para mostrar la cantidad de niñas registradas este mes */}
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  Cantidad de niñas registradas este mes
                </CardDescription>
                <CardTitle className="text-4xl">
                  <span className="text-pink-500">{femaleCountThisMonth}</span>{" "}
                  niñas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  Cantidad de niñas registradas el mes pasado:{" "}
                  <span className="text-pink-500">{maleCountLastMonth}</span>{" "}
                  niñas
                </div>
              </CardContent>
              <CardFooter>
                {/* Puedes agregar un progreso si lo deseas */}
              </CardFooter>
            </Card>
            {/* Tarjeta para mostrar la cantidad de mediciones este mes */}
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  Cantidad de mediciones este mes
                </CardDescription>
                <CardTitle className="text-4xl">
                  <span className="text-blue-500">
                    {measurementsCountThisMonth}
                  </span>{" "}
                  mediciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  Cantidad de mediciones registradas este mes:{" "}
                  <span className="text-blue-500">
                    {measurementsCountThisMonth}
                  </span>{" "}
                  mediciones
                </div>
                <div className="text-md text-muted-foreground">
                  Cantidad de mediciones registradas el mes pasado:{" "}
                  <span className="text-blue-500">
                    {measurementsCountLastMonth}
                  </span>{" "}
                  mediciones
                </div>
                <div className="text-md text-muted-foreground mt-2">
                  Promedio de longitud (cm) este mes:{" "}
                  <span className="text-blue-500">
                    {avgLengthThisMonth.toFixed(2)}
                  </span>{" "}
                  cm
                </div>
                <div className="text-md text-muted-foreground mt-2">
                  Promedio de longitud (cm) el mes pasado:{" "}
                  <span className="text-blue-500">
                    {avgLengthLastMonth.toFixed(2)}
                  </span>{" "}
                  cm
                </div>
              </CardContent>
              <CardFooter>
                {/* Puedes agregar un progreso si lo deseas */}
              </CardFooter>
            </Card>
            {/* Peso */}
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg">
                  Cantidad de mediciones de peso este mes
                </CardDescription>
                <CardTitle className="text-4xl">
                  <span className="text-yellow-500">
                    {measurementsCountThisMonth}
                  </span>{" "}
                  mediciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  Cantidad de mediciones registradas este mes:{" "}
                  <span className="text-yellow-500">
                    {measurementsCountThisMonth}
                  </span>{" "}
                  mediciones
                </div>
                <div className="text-md text-muted-foreground">
                  Cantidad de mediciones registradas el mes pasado:{" "}
                  <span className="text-yellow-500">
                    {measurementsCountLastMonth}
                  </span>{" "}
                  mediciones
                </div>
                <div className="text-md text-muted-foreground mt-2">
                  Promedio de peso (lb) este mes:{" "}
                  <span className="text-yellow-500">
                    {avgWeightThisMonth.toFixed(2)}
                  </span>{" "}
                  lb
                </div>
                <div className="text-md text-muted-foreground mt-2">
                  Promedio de peso (lb) el mes pasado:{" "}
                  <span className="text-yellow-500">
                    {avgWeightLastMonth.toFixed(2)}
                  </span>{" "}
                  lb
                </div>
              </CardContent>
              <CardFooter>
                {/* Puedes agregar un progreso si lo deseas */}
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:items-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="flex flex-col shadow-lg">
              <CardHeader className="items-center pb-2">
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  Bebés por comunidad lingüística
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Reporte mensual sobre la cantidad de bebés por comunidad
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                {data4.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
                  >
                    <PieChart width={300} height={300}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={data4}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        innerRadius="40%"
                        strokeWidth={4}
                      >
                        {data4.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-gray-500">Cargando datos...</p>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                {data4.length > 0 && (
                  <div className="font-medium text-base sm:text-lg">
                    <strong>Comunidad con más bebés:</strong>{" "}
                    {maxCommunity.name}
                    <div>
                      <strong>Número de bebés:</strong> {maxCommunity.value}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
            {/* Chart 2 */}
            <AlertaGrafico />
            {/* Chart 3 */}
            <Card>
              <CardHeader>
                <CardTitle>Reportes por mes</CardTitle>
                <CardDescription>
                  Reporte mensual de la cantidad de reportes registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data3.length > 0 ? (
                  <ChartContainer config={chartConfig2}>
                    <BarChart
                      data={data3}
                      width={500}
                      height={300}
                      accessibilityLayer
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="monthYear"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                          chartConfig2[value] ? chartConfig2[value] : value
                        }
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="reportes"
                        strokeWidth={2}
                        radius={8}
                        activeIndex={2}
                        activeBar={({ ...props }) => {
                          return (
                            <Rectangle
                              {...props}
                              fillOpacity={0.8}
                              stroke={props.payload.fill}
                              strokeDasharray={4}
                              strokeDashoffset={4}
                            />
                          );
                        }}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <p>Cargando datos...</p> // Aquí puedes usar un spinner si lo prefieres
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2 ">
                <span>Total de reportes:</span>
                <span className="text-lg font-bold ml-2">
                  {" "}
                  {data3.length > 0
                    ? data3.reduce((total, item) => total + item.reportes, 0)
                    : 0}
                </span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <div className=" justify-center items-center">
        <DataTable />
      </div>

      <TiemRaspberry />

      {/* <DataTable /> */}
      <div className="flex justify-center items-center my-10"></div>
    </>
  );
}
