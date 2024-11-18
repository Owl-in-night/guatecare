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
import { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Importar métodos para obtener y actualizar documentos

function ReMediciones({ babyId }) {
  const [distance, setDistance] = useState(null); // Para almacenar la distancia
  const [length, setLength] = useState(null); // Para almacenar la longitud
  const [weight, setWeight] = useState(null); // Para almacenar el peso
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [error, setError] = useState(null); // Para manejar errores
  const { t } = useTranslation("global"); // Traducción

  useEffect(() => {
    // Aquí podrías cargar la información inicial del bebé si es necesario.
    // Por ejemplo, obtener la última medición del bebé (talla y peso).
  }, [babyId]);

  // Función para medir talla (distancia/longitud)
  const handleMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://raspberrypisantos.local:5000/sensor");
      const distanciaPromedio = response.data.distancia_promedio;
      const longitudPromedio = response.data.longitud_promedio;

      setDistance(distanciaPromedio); // Guardar distancia en cm
      setLength(longitudPromedio); // Guardar longitud en cm
    } catch (error) {
      console.error("Error midiendo la distancia:", error);
      setError("Hubo un problema al medir la distancia. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para medir peso
  const handleWeightMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://raspberrypisantos.local:5000/weight");
      const weightData = response.data.weight; // Suponiendo que el peso viene en el campo `weight`
      setWeight(weightData); // Guardar el peso
    } catch (error) {
      console.error("Error midiendo el peso:", error);
      setError("Hubo un problema al medir el peso. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar los datos
  const handleSave = async () => {
    try {
      const babyRef = doc(db, "bebe", babyId); // Referencia al documento del bebé en la colección 'bebe'

      // Obtener los datos actuales del bebé
      const babyDoc = await getDoc(babyRef);
      if (babyDoc.exists()) {
        const babyData = babyDoc.data();

        // Crear nuevos campos incrementales para talla y peso
        const newTallaField = `talla${Object.keys(babyData).filter(key => key.startsWith("talla")).length + 1}`;
        const newPesoField = `peso${Object.keys(babyData).filter(key => key.startsWith("peso")).length + 1}`;

        // Verificar si ya existen datos de peso y talla para el bebé
        if (length !== null && weight !== null) {
          // Actualizar los datos del bebé en la colección 'bebe'
          await updateDoc(babyRef, {
            [newTallaField]: length, // Guardar talla
            [newPesoField]: weight, // Guardar peso
          });
          alert("Datos de medición guardados con éxito.");
        } else {
          alert("Debe ingresar tanto el peso como la talla para guardar los datos.");
        }
      } else {
        console.error("No se encontró el documento del bebé.");
        setError("No se pudo encontrar el bebé con el ID proporcionado.");
      }
    } catch (error) {
      console.error("Error añadiendo el documento: ", error);
      setError("Hubo un problema al guardar los datos. Por favor, inténtalo de nuevo más tarde.");
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
          src="/img/remediciones.png"
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
                  {t("dashboard.mediciones.size/length")}: {length.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rsl")} {/* En cm */}
                </p>
                <p>
                  {t("dashboard.mediciones.size/length")}:{" "}
                  {(length / 100).toFixed(2)} {t("dashboard.mediciones.rls2")}{" "}
                  {/* Mostrar en metros */}
                </p>
              </>
            )}
            {weight !== null && (
              <p>
                {t("dashboard.mediciones.weight")}: {weight.toFixed(2)} kg
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={length === null || weight === null} // Habilitar solo si hay datos de talla y peso
            >
              {t("dashboard.buttons.save")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default ReMediciones;
