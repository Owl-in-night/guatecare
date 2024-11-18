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
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

// Días de la semana en español
const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const chartConfig = {
  commonColor: "hsl(348, 87%, 61%)",
};

const convertToPercentage = (secondsOn) => ((secondsOn / 86400) * 100).toFixed(2);
const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentDay = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];
};

const saveBackup = async (uptimeSeconds, percentage, day, date) => {
  const time = new Date().toISOString();
  const backupRef = doc(db, "time", `backup_${date}_${day}`);
  await setDoc(backupRef, { uptime_seconds: uptimeSeconds, percentage, day, date, time }, { merge: true });
};

const saveDayDataToFirebase = async (uptimeSeconds, percentage, day, date) => {
  const time = new Date().toISOString();
  const dayRef = doc(db, "time", `${day}_${date}`);
  await setDoc(dayRef, { uptime_seconds: uptimeSeconds, percentage, day, date, time }, { merge: true });
};

const getLastDayDataFromFirebase = async (day, date) => {
  const dayRef = doc(db, "time", `${day}_${date}`);
  const daySnap = await getDoc(dayRef);

  if (daySnap.exists()) {
    const data = daySnap.data();
    return {
      visitors: data.percentage || 0,
      timeOn: convertSecondsToTime(data.uptime_seconds || 0),
    };
  }
  return { visitors: 0, timeOn: "00:00:00" };
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
      const response = await axios.get("http://raspberrypisantos.local:5000/api/uptime");
      const uptimeSeconds = response.data?.uptime_seconds % 86400 || 0;
      const percentage = convertToPercentage(uptimeSeconds);
      const today = getCurrentDay();
      const date = getCurrentDate();

      // Reiniciar datos si cambia el día
      if (date !== lastDate) {
        await saveBackup(uptimeRef.current, convertToPercentage(uptimeRef.current), currentDay, lastDate);
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
            ? { ...item, visitors: percentage, timeOn: convertSecondsToTime(uptimeSeconds) }
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
            ? { ...item, visitors: lastDayData.visitors, timeOn: lastDayData.timeOn }
            : item
        )
      );
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const today = getCurrentDay();
      const date = getCurrentDate();
      const lastDayData = await getLastDayDataFromFirebase(today, date);

      setChartData((prevData) =>
        prevData.map((item) =>
          item.day === today
            ? { ...item, visitors: lastDayData.visitors, timeOn: lastDayData.timeOn }
            : item
        )
      );
    };

    initializeData();
    const interval = setInterval(fetchUptime, 3000);

    return () => clearInterval(interval);
  }, [lastDate]);

  return (
    <Card className="max-w-lg w-full mx-auto my-4 p-4 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Gráfico de actividad de la Raspberry Pi por día</CardTitle>
        <CardDescription>
          Tiempo de actividad de la Raspberry Pi esta semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="relative">
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="visitors" fill={chartConfig.commonColor} strokeWidth={2} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Porcentaje actual: {chartData.find((item) => item.day === currentDay)?.visitors || "0"}% sobre el 100% o 24 horas
        </div>
        <div className="leading-none text-muted-foreground">
          Tiempo de actividad de la Raspberry Pi para hoy ({currentDay}) - {chartData.find((item) => item.day === currentDay)?.timeOn || "00:00:00"}
        </div>
      </CardFooter>
    </Card>
  );
}

export default TiemRaspberry;
