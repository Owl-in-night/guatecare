import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { format } from "date-fns";

import { Label } from "@/components/ui/label";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//Firebase
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom"; // para obtener el ID de la URL

export default function ReadRegistro() {
  const { t } = useTranslation("global");
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nameE: "",
    born: "",
    dirr: "",
    fallecio: false,
    comunidadLing: "",
  });

  const [formDataB, setFormDataB] = useState({
    gen: false,
    pue: "",
    comu: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRefBebe = doc(db, "bebe", id);
        const docSnapBebe = await getDoc(docRefBebe);

        if (docSnapBebe.exists()) {
          const dataBebe = docSnapBebe.data();
          const encargadoId = dataBebe.encargadoId;

          const docRefEncargado = doc(db, "encargado", encargadoId);
          const docSnapEncargado = await getDoc(docRefEncargado);

          if (docSnapEncargado.exists()) {
            const dataEncargado = docSnapEncargado.data();
            setFormData({
              nameE: dataEncargado.nombreEncargado || "",
              dirr: dataEncargado.direccion || "",
              fallecio: dataEncargado.fallecio || false,
              comunidadLing: dataEncargado.comunidadLinguistica || "",
              born: dataEncargado.fechaNacimiento?.toDate
                ? format(dataEncargado.fechaNacimiento.toDate(), "dd-MM-yyyy")
                : "",
            });

            setFormDataB({
              gen: dataBebe.genero || false,
              pue: dataBebe.pueblo || "",
              comu: dataBebe.comunidadLinguistica || "",
            });
          } else {
            setError(t("dashboard.registro.encargadoNotFound"));
          }
        } else {
          setError(t("dashboard.registro.bebeNotFound"));
        }
      } catch (error) {
        console.error("Error obteniendo los documentos:", error);
        setError(t("dashboard.registro.errorLoading"));
      }
    };

    fetchData();
  }, [id, t]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8">
      {/* Forms 1 */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            Lectura de datos del encargado
          </CardTitle>
          <CardDescription>
            En este espacio encontrarás los datos relacionados al encargado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameE" className="block">
                {t("dashboard.registro.name")}
              </Label>
              <p>{formData.nameE}</p> {/* Mostrar el nombre del encargado */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="born" className="block">
                {t("dashboard.registro.born")}
              </Label>
              <p>{formData.born}</p> {/* Mostrar la fecha de nacimiento */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dirr" className="block">
                {t("dashboard.registro.description3")}
              </Label>
              <p>{formData.dirr}</p> {/* Mostrar la dirección */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallecio" className="block">
                {t("dashboard.registro.fallecio")}
              </Label>
              <p>
                {formData.fallecio
                  ? t("dashboard.registro.yes")
                  : t("dashboard.registro.no")}
              </p>{" "}
              {/* Mostrar si falleció */}
            </div>

            {/* Comunidada 1 */}
            <div className="space-y-2">
              <Label htmlFor="comunidadLing" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <p>{formData.comunidadLing}</p>{" "}
              {/* Mostrar la comunidad lingüística */}
            </div>
          </form>
        </CardContent>
      </Card>

      <img
        alt="GuateCare"
        src="/img/read.png"
        className="w-80 md:w-1/3 object-cover mb-4 md:mb-0 md:mr-4"
      />

      {/* Forms 2 */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">Lectura de datos del bebé</CardTitle>
          <CardDescription>
            En este espacio encontrarás los datos relacionados al bebé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genere" className="block">
                {t("dashboard.registro.genere")}
              </Label>
              <p>
                {formDataB.gen
                  ? t("dashboard.registro.male")
                  : t("dashboard.registro.famale")}
              </p>{" "}
              {/* Mostrar el género */}
            </div>

            {/* Pueblo */}
            <div className="space-y-2">
              <Label htmlFor="pueblo" className="block">
                {t("dashboard.registro.pueblo")}
              </Label>
              <p>{formDataB.pue}</p> {/* Mostrar el pueblo */}
            </div>
            {/* Nuevo select para la comunidad lingüística */}
            <div className="space-y-2">
              <Label htmlFor="comu" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <p>{formDataB.comu}</p> {/* Mostrar la comunidad lingüística */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
