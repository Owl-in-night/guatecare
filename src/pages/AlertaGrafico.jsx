import { useState, useEffect } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

function AlertaGrafico() {
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col m-2 w-auto">
      <CardHeader>
        <CardTitle>Frecuencia de signos de desnutrición</CardTitle>
      </CardHeader>
      <CardContent>
        {signosData.length > 0 ? (
          <BarChart width={400} height={300} data={signosData} cursor={false}>
            <XAxis dataKey="name" />
            <YAxis />
            {/* Quitar Tooltip y Legend */}
            <Bar dataKey="value" fill="#ff6666" />
          </BarChart>
        ) : (
          <p>Cargando datos...</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertaGrafico;
