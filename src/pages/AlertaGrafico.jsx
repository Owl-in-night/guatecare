import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

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
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";


function AlertaGrafico() {
  const [t] = useTranslation("global");
  const [signosData, setSignosData] = useState([]);

  // Configuración del gráfico
  const chartConfig = {
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
    <Card className="flex flex-col max-w-[460px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Encabezado */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
        {t("home.charts.text5")}
        </CardTitle>
        <CardDescription>
        {t("home.charts.text6")}
        </CardDescription>
      </CardHeader>

      {/* Contenido */}
      <CardContent>
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
                    fill="#ff0000" // Cambiamos el color a rojo
                  >
                    <LabelList position="top" className="fill-foreground" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertaGrafico;
