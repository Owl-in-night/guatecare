import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Weight } from "lucide-react";
import { Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

function Mediciones() {
  const [distance, setDistance] = useState(null); // Para almacenar la distancia
  const [length, setLength] = useState(null); // Para almacenar la longitud
  const [pesoKg, setPesoKg] = useState(null); // Para peso en kg
  const [pesoLb, setPesoLb] = useState(null); // Para peso en lb
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores
  const { t } = useTranslation("global"); // Traducción

  // Obtener mediciones de distancia/longitud
  const handleMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://c877-2800-98-1a07-24c4-8284-3a8f-1fd3-d945.ngrok-free.app/sensor"
      );
      const distanciaPromedio = response.data.distancia_promedio;
      const longitudPromedio = response.data.longitud_promedio;

      setDistance(distanciaPromedio); // Guardar distancia en cm
      setLength(longitudPromedio); // Guardar longitud en cm
    } catch (error) {
      console.error("Error midiendo la distancia:", error);
      setError(
        "Hubo un problema al medir la distancia. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Obtener mediciones de peso
  const handleWeightMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://c877-2800-98-1a07-24c4-8284-3a8f-1fd3-d945.ngrok-free.app/weight"
      );
      const pesoData = response.data.data;
      setPesoKg(pesoData.kilograms); // Guardar peso en kg
      setPesoLb(pesoData.pounds); // Guardar peso en lb
    } catch (error) {
      console.error("Error midiendo el peso:", error);
      setError(
        "Hubo un problema al medir el peso. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Guardar mediciones en Firebase
  const handleSave = async () => {
    try {
      await addDoc(collection(db, "measurements"), {
        distancia: distance, // En cm
        longitud_cm: length, // En cm
        longitud_m: length / 100, // En metros
        peso_kg: pesoKg, // Peso en kg
        peso_lb: pesoLb, // Peso en lb
        timestamp: new Date(),
      });
      alert("Datos guardados con éxito");
    } catch (error) {
      console.error("Error añadiendo el documento: ", error);
      setError(
        "Hubo un problema al guardar los datos. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4">
        <div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleMeasure}
            disabled={loading}
          >
            <Ruler className="w-4 h-4 mr-2" />
            {t("dashboard.mediciones.botton1")}
          </Button>
          <Button
            variant="outline"
            onClick={handleWeightMeasure}
            disabled={loading}
            className="border-blue-500"
          >
            <Weight className="w-4 h-4 mr-2" />
            {t("dashboard.mediciones.botton2")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen px-4">
        <img
          alt="GuateCare"
          src="/img/mediciones.png"
          className="w-80 md:w-1/3 object-cover mb-4 md:mb-0 md:mr-4"
        />
        <Card className="w-full md:w-1/2 max-w-md">
          <CardHeader>
            <CardTitle>{t("dashboard.mediciones.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.mediciones.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {distance !== null && length !== null && (
              <>
                <p>
                  {t("dashboard.mediciones.size/length")} {length.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rsl")} {/* En cm */}
                </p>
                <p>
                  {t("dashboard.mediciones.size/length")}{" "}
                  {(length / 100).toFixed(2)} {t("dashboard.mediciones.rls2")}{" "}
                  {/* En metros */}
                </p>
              </>
            )}
            {pesoKg !== null && pesoLb !== null && (
              <>
                <p>
                  Peso en kg: {pesoKg.toFixed(2)} kg
                </p>
                <p>
                  Peso en lb: {pesoLb.toFixed(2)} lb
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={
                distance === null ||
                length === null ||
                pesoKg === null ||
                pesoLb === null
              }
            >
              {t("dashboard.buttons.save")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Mediciones;
