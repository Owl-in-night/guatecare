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
import { db } from "@/firebase";
import { collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, setDoc, doc } from "firebase/firestore";
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
import { useParams } from "react-router-dom";

function ReMediciones() {
  const [distance, setDistance] = useState(null);
  const [length, setLength] = useState(null);
  const [weightKg, setWeightKg] = useState(null);
  const [weightLb, setWeightLb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation("global");
  const { id } = useParams(); // ID del bebé

  useEffect(() => {
    document.title = `${t("dashboard.navbar.remedir")} | GuateCare`;
  }, [t]);
  
  const handleMeasure = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://deep-personally-pug.ngrok-free.app/sensor",
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      setDistance(response.data.distancia_promedio);
      setLength(response.data.longitud_promedio);
    } catch (error) {
      console.error("Error obteniendo medidas:", error);
      setError(t("errors.errorl"));
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
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
  
      const weightData = response.data.data || {};
      setWeightKg(weightData.kilograms || 0);
      setWeightLb(weightData.pounds || 0);
    } catch (error) {
      console.error("Error obteniendo peso:", error);
      setError(t("errors.errorp"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    setError(null);
    setLoading(true);
  
    try {
      if (length === null || weightKg === null || weightLb === null) {
        alert(t("errors.missing_data"));
        return;
      }
  
      // Colección de remediciones
      const reMedirCollection = collection(db, "remedir");
  
      // Crear una referencia al documento con el ID del bebé
      const docRef = doc(reMedirCollection, id); // Usar el ID del bebé como ID del documento
  
      // Consulta para encontrar registros con el mismo idBebe
      const q = query(
        reMedirCollection,
        where("idBebe", "==", id) // Filtrar por el campo idBebe
      );
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Si existe un documento, actualízalo
        const docSnap = querySnapshot.docs[0];
        await updateDoc(docSnap.ref, {
          rlongitud_cm: [...(docSnap.data().rlongitud_cm || []), length],
          rlongitud_m: [...(docSnap.data().rlongitud_m || []), length / 100],
          rpeso_kg: [...(docSnap.data().rpeso_kg || []), weightKg],
          rpeso_lb: [...(docSnap.data().rpeso_lb || []), weightLb],
          timestamp: new Date().toISOString(), // Actualiza el timestamp
        });
      } else {
        // Si no existe, crea un nuevo registro con el ID del bebé
        await setDoc(docRef, {
          idBebe: id, // Relaciona el ID del bebé
          rlongitud_cm: [length],
          rlongitud_m: [length / 100],
          rpeso_kg: [weightKg],
          rpeso_lb: [weightLb],
          timestamp: new Date().toISOString(),
        });
      }
  
      alert(t("errors.data_saved"));
    } catch (error) {
      console.error("Error al guardar remediciones:", error);
      setError(t("errors.errors"));
    } finally {
      setLoading(false);
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
                  {t("dashboard.mediciones.size/length")} {length.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rsl")}
                </p>
                <p>
                  {t("dashboard.mediciones.size/length")}{" "}
                  {(length / 100).toFixed(2)} {t("dashboard.mediciones.rls2")}
                </p>
              </>
            )}
            {weightKg !== null && weightLb !== null && (
              <>
                <p>
                  {t("dashboard.mediciones.weight")} {weightKg.toFixed(2)}{" "}
                  {t("dashboard.mediciones.rw2")}
                </p>
                <p>
                  {t("dashboard.mediciones.weight")} {weightLb.toFixed(2)}{" "}
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
                  <AlertDialogTitle>
                    {t("dialog.confirm.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dialog.confirm.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("dialog.buttons.cancel")}
                  </AlertDialogCancel>
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
