"use client";

import { useState, useEffect, useRef } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
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
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

// Días de la semana en español
const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const chartConfig = {
  commonColor: "hsl(348, 87%, 61%)",
};

const convertToPercentage = (secondsOn) =>
  ((secondsOn / 86400) * 100).toFixed(2);
const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentDay = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];
};

// Función para obtener el inicio de la semana (lunes)
const getStartOfWeek = (date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Si es domingo, ajustamos al lunes anterior
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  return startOfWeek.toISOString().split("T")[0];
};

// Cargar todos los datos de la semana actual desde Firebase
const getWeekDataFromFirebase = async (weekStartDate) => {
  const weekData = [];
  const startOfWeek = new Date(weekStartDate);
  for (let i = 0; i < 7; i++) {
    const currentDay = daysOfWeek[i];
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayRef = doc(db, "time", `${currentDay}_${dateStr}`);
    const daySnap = await getDoc(dayRef);
    if (daySnap.exists()) {
      const data = daySnap.data();
      weekData.push({
        day: currentDay,
        visitors: data.percentage || 0,
        timeOn: convertSecondsToTime(data.uptime_seconds || 0),
      });
    } else {
      weekData.push({
        day: currentDay,
        visitors: 0,
        timeOn: "00:00:00",
      });
    }
  }
  return weekData;
};

const saveBackup = async (uptimeSeconds, percentage, day, date) => {
  const time = new Date().toISOString();
  const backupRef = doc(db, "time", `backup_${date}_${day}`);
  await setDoc(
    backupRef,
    { uptime_seconds: uptimeSeconds, percentage, day, date, time },
    { merge: true }
  );
};

const saveDayDataToFirebase = async (uptimeSeconds, percentage, day, date) => {
  const time = new Date().toISOString();
  const dayRef = doc(db, "time", `${day}_${date}`);
  await setDoc(
    dayRef,
    { uptime_seconds: uptimeSeconds, percentage, day, date, time },
    { merge: true }
  );
};

function TiemRaspberry() {
  const [chartData, setChartData] = useState(
    daysOfWeek.map((day) => ({ day, visitors: 0, timeOn: "00:00:00" }))
  );
  const [currentDay, setCurrentDay] = useState(getCurrentDay());
  const [lastDate, setLastDate] = useState(getCurrentDate());
  const uptimeRef = useRef(0);

  const fetchUptime = async () => {
    try {
      const response = await axios.get(
        "https://deep-personally-pug.ngrok-free.app/api/uptime",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const uptimeSeconds = response.data?.uptime_seconds % 86400 || 0;
      const percentage = convertToPercentage(uptimeSeconds);
      const today = getCurrentDay();
      const date = getCurrentDate();

      // Reiniciar datos si cambia el día
      if (date !== lastDate) {
        await saveBackup(
          uptimeRef.current,
          convertToPercentage(uptimeRef.current),
          currentDay,
          lastDate
        );
        uptimeRef.current = 0;
        setLastDate(date);
        setCurrentDay(today);
      }

      // Actualizar datos actuales
      uptimeRef.current = uptimeSeconds;
      await saveDayDataToFirebase(uptimeSeconds, percentage, today, date);

      setChartData((prevData) =>
        prevData.map((item) =>
          item.day === today
            ? {
                ...item,
                visitors: percentage,
                timeOn: convertSecondsToTime(uptimeSeconds),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error al obtener los datos de la Raspberry Pi:", error);

      // Si no se obtienen datos, cargar el último registro desde Firebase
      const today = getCurrentDay();
      const date = getCurrentDate();
      const lastDayData = await getLastDayDataFromFirebase(today, date);

      setChartData((prevData) =>
        prevData.map((item) =>
          item.day === today
            ? {
                ...item,
                visitors: lastDayData.visitors,
                timeOn: lastDayData.timeOn,
              }
            : item
        )
      );
    }
  };

  const getLastDayDataFromFirebase = async (today, date) => {
    const weekStartDate = getStartOfWeek(date); // Obtener fecha de inicio de la semana
    const weekData = await getWeekDataFromFirebase(weekStartDate);

    // Verificar si hay datos en la semana anterior
    const lastDayData = weekData.find((item) => item.day === today);
    return lastDayData || { visitors: 0, timeOn: "00:00:00" };
  };

  useEffect(() => {
    const initializeData = async () => {
      const weekStartDate = getStartOfWeek(getCurrentDate()); // Obtener fecha de inicio de la semana
      const weekData = await getWeekDataFromFirebase(weekStartDate);
      console.log("Semana cargada: ", weekData); // Debugging
      setChartData(weekData);
    };

    initializeData();
    const interval = setInterval(fetchUptime, 3000);

    return () => clearInterval(interval);
  }, [lastDate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="lg:w-1/2 xl:w-4/5 2xl:w-5/6 shadow-lg rounded-lg m-2">
        <CardHeader>
          <CardTitle>
            Gráfico de actividad de la Raspberry Pi por semana
          </CardTitle>
          <CardDescription>
            Tiempo de actividad de la Raspberry Pi esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="relative">
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="visitors"
                fill={chartConfig.commonColor}
                strokeWidth={2}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <span className="text-lg font-bold">{currentDay}</span>
          <span>
            Tiempo de actividad:{" "}
            {chartData.find((d) => d.day === currentDay)?.timeOn || "00:00:00"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TiemRaspberry;
