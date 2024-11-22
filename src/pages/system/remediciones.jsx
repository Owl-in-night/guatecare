import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Weight, Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
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

function ReMediciones({ babyId }) {
  const [distance, setDistance] = useState(null);
  const [length, setLength] = useState(null);
  const [weightKg, setWeightKg] = useState(null);
  const [weightLb, setWeightLb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation("global");

  useEffect(() => {
    document.title = `${t("dashboard.navbar.remedir")} | GuateCare`;
  }, [t]);

  const handleMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://raspberrypisantos.local:5000/sensor",
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
      setDistance(response.data.distancia_promedio);
      setLength(response.data.longitud_promedio);
    } catch (error) {
      setError(t(
        "errors.errorl"
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleWeightMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://raspberrypisantos.local:5000/weight",
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
      setWeightKg(response.data.weight.kg);
      setWeightLb(response.data.weight.lb);
    } catch (error) {
      setError(t(
        "errors.errorp"
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (length !== null && weightKg !== null && weightLb !== null) {
        const reMedirCollection = collection(db, "remedir");
        await addDoc(reMedirCollection, {
          babyId,
          lengthCm: length,
          lengthM: length / 100,
          weightKg,
          weightLb,
          timestamp: new Date().toISOString(),
        });
        alert(t("errors.data_saved"));
      } else {
        alert(t("errors.missing_data"));
      }
    } catch (error) {
      setError(t(
        "errors.errors"
      ));
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
            {length !== null && (
              <>
                <p>
                  {t("dashboard.mediciones.size/length")}: {length.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rsl")}
                </p>
                <p>
                  {t("dashboard.mediciones.size/length")}:{" "}
                  {(length / 100).toFixed(2)} {t("dashboard.mediciones.rls2")}
                </p>
              </>
            )}
            {weightKg !== null && weightLb !== null && (
              <>
                <p>
                  {t("dashboard.mediciones.weight")}: {weightKg.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rw2")}
                </p>
                <p>
                  {t("dashboard.mediciones.weight")}: {weightLb.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rw")}
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={
                    length === null || weightKg === null || weightLb === null
                  }
                >
                  {t("dashboard.buttons.save")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("dialog.confirm.title")}</AlertDialogTitle>
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

export default ReMediciones;
