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
  ResponsiveContainer,
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
import {
  BookOpen,
  CircleChevronDown,
  CircleChevronUp,
  CircleFadingArrowUp,
} from "lucide-react";

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
        // console.error("Error al obtener los datos de Firebase:", error);
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
        // console.error("Error al obtener los datos de Firebase:", error);
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
        // console.error(
        //   "Error al obtener los datos de bebés por comunidad:",
        //   error
        // );
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
        // console.error("Error al obtener los datos:", error);
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
        // console.log("Consulta de Firestore:", querySnapshot);

        const alertasPorDia = {}; // Agrupar por día
        const alertasPorHora = {}; // Agrupar por hora

        querySnapshot.forEach((doc) => {
          const { timestamp } = doc.data();
          // console.log("Timestamp del documento:", timestamp);

          // Convertir la cadena de timestamp a Date (asumimos que el timestamp es ISO 8601)
          const fecha = new Date(timestamp); // Si la cadena es un formato ISO válido, debería funcionar correctamente
          if (isNaN(fecha)) {
            // console.error("Fecha no válida:", timestamp);
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

        // console.log("Alertas por día:", alertasPorDia);
        // console.log("Alertas por hora:", alertasPorHora);

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
        // console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault(); // Evita el comportamiento por defecto del <a>
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth", // Desplazamiento suave
        block: "start", // Desplazarse al principio de la sección
      });
    }
  };

  const [signosData, setSignosData] = useState([]);

  // Configuración del gráfico
  const chartConfig3 = {
    signos: {
      label: "Signos de Desnutrición",
      color: "#ff0000", // Color rojo en hexadecimal
    },
  };

  // Fetch de datos desde Firestore
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

  return (
    <div className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div
        id="section1"
        className="absolute inset-0 -z-10 overflow-hidden"
      ></div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-xl font-semibold text-indigo-600"> </p>
              <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("home.card1.text2")}
              </h1>
              <p className="mt-6 text-6xl lg:text-9xl md:text-4xl xl:text-9xl text-red-500 font-bold ">
                {activeAlerts}{" "}
                {activeAlerts === 1
                  ? t("home.card1.text4") // Caso cuando hay 1 alerta
                  : t("home.card1.text3")}{" "}
              </p>
              <p>
                {activeAlerts > 0 && (
                  <div className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-3xl font-semibold text-red-500 flex items-center">
                    <span className="mr-2">🚨</span>
                    {activeAlerts > 10
                      ? t("home.card1.criticalAlert")
                      : t("home.card1.warningAlert")}
                  </div>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="/img/alertasfondo.png"
            className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
          />
          <div className="flex items-center space-x-4 mt-4">
            <a
              href="#section2"
              onClick={(e) => scrollToSection(e, "section2")}
              className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
            >
              <CircleChevronDown className="ml-2 size-20" />
            </a>
            <a
              href="#section10"
              onClick={(e) => scrollToSection(e, "section10")}
              className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
            >
              <CircleFadingArrowUp className="ml-2 size-20 rotate-180" />
            </a>
          </div>
        </div>
      </div>
      {/* Section2 */}
      <div
        id="section2"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.card2.text1")}
                </h1>
                <p className="mt-6 text-6xl lg:text-9xl md:text-4xl xl:text-9xl text-blue-500 font-bold ">
                  {maleCountThisMonth} {t("home.card2.text2")}
                </p>
                <p className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-semibold flex items-center">
                  {t("home.card2.text3")}
                </p>
                <span className="text-blue-500 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-bold">
                  {maleCountLastMonth} {t("home.card2.text2")}
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/niño.png"
              className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            />
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section3"
                onClick={(e) => scrollToSection(e, "section3")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section1"
                onClick={(e) => scrollToSection(e, "section1")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* End section2 */}
      <div
        id="section3"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.card3.text1")}
                </h1>
                <p className="mt-6 text-6xl lg:text-9xl md:text-4xl xl:text-9xl text-pink-500 font-bold ">
                  {femaleCountThisMonth} {t("home.card3.text2")}
                </p>
                <p className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-semibold flex items-center">
                  {t("home.card3.text3")}{" "}
                </p>
                <span className="text-pink-500 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-bold">
                  {femaleCountLastMonth} {t("home.card3.text2")}
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/niña.png"
              className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            />
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section4"
                onClick={(e) => scrollToSection(e, "section4")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section2"
                onClick={(e) => scrollToSection(e, "section2")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* End section3 */}
      {/* Section4 */}
      <div
        id="section4"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.card4.text1")}
                </h1>
                <p className="mt-6 text-6xl lg:text-7xl md:text-4xl xl:text-8xl text-indigo-800 font-bold ">
                  {measurementsCountThisMonth} {t("home.card4.text2")}
                </p>
                <p className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-semibold flex items-center">
                  {t("home.card4.text4")}{" "}
                </p>
                <span className="text-indigo-800 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-bold">
                  {measurementsCountLastMonth} {t("home.card4.text2")}
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/tallapeso.png"
              className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            />
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section5"
                onClick={(e) => scrollToSection(e, "section5")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section3"
                onClick={(e) => scrollToSection(e, "section3")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section5 */}
      <div
        id="section5"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.card4.text5")}
                </h1>
                <p className="mt-6 text-6xl lg:text-7xl md:text-4xl xl:text-8xl text-emerald-700 font-bold ">
                  {avgLengthThisMonth.toFixed(2)} {t("home.card4.text6")}
                </p>
                <p className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-semibold flex items-center">
                  {t("home.card4.text7")}{" "}
                </p>
                <span className="text-emerald-700 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-bold">
                  {avgLengthLastMonth.toFixed(2)} {t("home.card4.text6")}
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/talla.png"
              className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            />
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section6"
                onClick={(e) => scrollToSection(e, "section6")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section4"
                onClick={(e) => scrollToSection(e, "section4")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section6 */}
      <div
        id="section6"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.card5.text5")}
                </h1>
                <p className="mt-6 text-6xl lg:text-7xl md:text-4xl xl:text-8xl text-orange-600 font-bold ">
                  {avgWeightThisMonth.toFixed(2)} {t("home.card5.text6")}
                </p>
                <p className="mt-2 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-semibold flex items-center">
                  {t("home.card5.text7")}{" "}
                </p>
                <span className="text-orange-600 text-xl lg:text-9xl md:text-4xl xl:text-4xl font-bold">
                  {avgWeightLastMonth.toFixed(2)} {t("home.card5.text6")}
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/peso.png"
              className="w-[48rem] max-w-none rounded-xl shadow-xl sm:w-[57rem]"
            />
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section7"
                onClick={(e) => scrollToSection(e, "section7")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section5"
                onClick={(e) => scrollToSection(e, "section5")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section7 */}
      <div
        id="section7"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("home.charts.text1")}
                </h1>
                {/* Aquí agregas el <p> con las etiquetas dinámicas */}
                <p className="mt-6 text-6xl lg:text-7xl md:text-4xl xl:text-6xl text-orange-600 font-bold">
                  {data4.map((entry, index) => {
                    // Obtenemos el color de la celda
                    const color = COLORS[index % COLORS.length];

                    return (
                      <span key={index} style={{ color }}>
                        {entry.name}: {entry.value} <br />
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="-mt-12  lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            {/* Chart */}
            {data4.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full h-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
              >
                <PieChart>
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
            {/* Chart */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section8"
                onClick={(e) => scrollToSection(e, "section8")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section6"
                onClick={(e) => scrollToSection(e, "section6")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section8 */}
      <div
        id="section8"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="mt-6 text-4xl lg:text-7xl md:text-4xl xl:text-7xl  font-bold ">
                  {t("home.charts.text7")}
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            {/* Chart */}
            {data3.length > 0 ? (
              <ChartContainer
                config={chartConfig2}
                className="mx-auto aspect-square w-full h-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]"
              >
                <BarChart
                  data={data3}
                  width={500}
                  height={500}
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
            {/* Chart */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section9"
                onClick={(e) => scrollToSection(e, "section9")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section7"
                onClick={(e) => scrollToSection(e, "section7")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section9 */}
      <div
        id="section9"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="mt-6 text-4xl lg:text-7xl md:text-4xl xl:text-7xl  font-bold ">
                  {t("home.charts.text5")}
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 lg:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            {/* Chart */}
            {signosData.length > 0 ? (
              <div className="w-auto">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer>
                    <BarChart data={signosData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#4A5568" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#4A5568" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="value"
                        fill="#ffac51" // Cambiamos el color a rojo
                      >
                        <LabelList position="top" className="fill-foreground" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"></p>
            )}
            {/* Chart */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section10"
                onClick={(e) => scrollToSection(e, "section10")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronDown className="ml-2 size-20" />
              </a>
              <a
                href="#section8"
                onClick={(e) => scrollToSection(e, "section8")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Section10 */}
      <div
        id="section10"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="mt-6 text-4xl lg:text-7xl md:text-4xl xl:text-7xl  font-bold ">
                  {t("home.data.text1")}
                </p>
              </div>
            </div>
          </div>
          <div className="lg:-ml-12 -mt-12 lg:-mt-24 lg:p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            {/* Table */}
            <DataTable />
            {/* Table */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="#section9"
                onClick={(e) => scrollToSection(e, "section9")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleChevronUp className="ml-2 size-20" />
              </a>
              <a
                href="#section1"
                onClick={(e) => scrollToSection(e, "section1")}
                className="flex items-center  font-semibold mt-4 hidden md:flex lg:flex xl:flex 2xl:flex"
              >
                <CircleFadingArrowUp className="ml-2 size-20" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
