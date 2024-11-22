import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Weight, Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.title = `${t("dashboard.navbar.mediciones")} | GuateCare`;
  }, [t]);
  const handleMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://deep-personally-pug.ngrok-free.app/sensor",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const distanciaPromedio = response.data.distancia_promedio;
      const longitudPromedio = response.data.longitud_promedio;

      setDistance(distanciaPromedio); // Guardar distancia en cm
      setLength(longitudPromedio); // Guardar longitud en cm
    } catch (error) {
      setError(t(
        "errors.errorl"
      )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWeightMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://deep-personally-pug.ngrok-free.app/weight",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const pesoData = response.data.data;
      setPesoKg(pesoData.kilograms); // Guardar peso en kg
      setPesoLb(pesoData.pounds); // Guardar peso en lb
    } catch (error) {
      setError(t(
        "errors.errorp"
      )
      );
    } finally {
      setLoading(false);
    }
  };

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
      setError(t(
        "errors.errors"
      )
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
                  {t("dashboard.mediciones.rsl")}
                </p>
                <p>
                  {t("dashboard.mediciones.size/length")}{" "}
                  {(length / 100).toFixed(2)} {t("dashboard.mediciones.rls2")}
                </p>
              </>
            )}
            {pesoKg !== null && pesoLb !== null && (
              <>
                <p>{t("dashboard.mediciones.weight")} {pesoKg.toFixed(2)} {t("dashboard.mediciones.rw2")}</p>
                <p>{t("dashboard.mediciones.weight")} {pesoLb.toFixed(2)} {t("dashboard.mediciones.rw")}</p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={
                    distance === null ||
                    length === null ||
                    pesoKg === null ||
                    pesoLb === null
                  }
                >
                  {t("dashboard.buttons.save")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("dialog.confirm.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialog.confirm.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("dialog.buttons.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    {t("dialog.buttons.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Mediciones;
