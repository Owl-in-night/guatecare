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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom"; // para obtener el ID de la URL
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    distancia: 0,
    longitud_cm: 0,
    longitud_m: 0,
    peso_kg: 0,
    peso_lb: 0,
    rlongitud_cm: 0,
    rlongitud_m: 0,
    rpeso_kg: 0,
    rpeso_lb: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remediciones, setRemediciones] = useState(null); // Nuevo estado para almacenar los datos de remedir

  useEffect(() => {
    document.title = `${t("dashboard.navbar.leer")} | GuateCare`;
  }, [t]);

  // Primer useEffect: Cargar los datos del bebé y encargado
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRefBebe = doc(db, "bebe", id);
        const docSnapBebe = await getDoc(docRefBebe);

        if (docSnapBebe.exists()) {
          const dataBebe = docSnapBebe.data();
          const encargadoId = dataBebe.encargadoId;
          const measurementId = dataBebe.measurementId;

          // Obtener datos del encargado
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
          } else {
            setError(t("dashboard.registro.encargadoNotFound"));
          }

          // Verificar si existe el measurementId en la colección measurements
          if (measurementId) {
            const docRefMeasurement = doc(db, "measurements", measurementId);
            const docSnapMeasurement = await getDoc(docRefMeasurement);

            if (docSnapMeasurement.exists()) {
              const dataMeasurement = docSnapMeasurement.data();
              setFormDataB((prev) => ({
                ...prev,
                pue: dataBebe.pueblo || "",
                comu: dataBebe.comunidadLinguistica || "",
                distancia: dataMeasurement.distancia || 0,
                longitud_cm: dataMeasurement.longitud_cm || 0,
                longitud_m: dataMeasurement.longitud_m || 0,
                peso_kg: dataMeasurement.peso_kg || 0,
                peso_lb: dataMeasurement.peso_lb || 0,
              }));
            } else {
              setError(t("dashboard.registro.measurementNotFound"));
            }
          } else {
            setError(t("dashboard.registro.noMeasurementId"));
          }
        } else {
          setError(t("dashboard.registro.bebeNotFound"));
        }
      } catch (error) {
        setError(t("dashboard.registro.errorLoading"));
      }
    };

    fetchData();
  }, [id, t]);

  // Segundo useEffect: Cargar datos de remedir usando el idBebe
  useEffect(() => {
    const fetchRemedirData = async () => {
      try {
        // Obtener los datos de la colección remedir
        const remedicionesQuery = query(
          collection(db, "remedir"),
          where("idBebe", "==", id)
        );
        const remedicionesSnapshot = await getDocs(remedicionesQuery);

        if (!remedicionesSnapshot.empty) {
          const remedicionesData = remedicionesSnapshot.docs.map((doc) =>
            doc.data()
          );
          const latestRemedicion =
            remedicionesData[remedicionesData.length - 1];

          setFormDataB({
            rlongitud_cm: latestRemedicion.rlongitud_cm || [],
            rlongitud_m: latestRemedicion.rlongitud_m || [],
            rpeso_kg: latestRemedicion.rpeso_kg || [],
            rpeso_lb: latestRemedicion.rpeso_lb || [],
          });
        } else {
          // Si no hay datos, asignar arreglos vacíos
          setFormDataB({
            rlongitud_cm: [],
            rlongitud_m: [],
            rpeso_kg: [],
            rpeso_lb: [],
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    if (id) fetchRemedirData();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8">
      {/* Forms 1 */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("dashboard.read.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.read.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameE" className="block">
                {t("dashboard.registro.name")}
              </Label>
              <p>{formData.nameE}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="born" className="block">
                {t("dashboard.registro.born")}
              </Label>
              <p>{formData.born}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dirr" className="block">
                {t("dashboard.registro.description3")}
              </Label>
              <p>{formData.dirr}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallecio" className="block">
                {t("dashboard.registro.fallecio")}
              </Label>
              <p>
                {formData.fallecio
                  ? t("dashboard.registro.yes")
                  : t("dashboard.registro.no")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comunidadLing" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <p>{formData.comunidadLing}</p>
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
          <CardTitle className="text-3xl">
            {t("dashboard.read.title2")}
          </CardTitle>
          <CardDescription>{t("dashboard.read.description2")}</CardDescription>
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
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pueblo" className="block">
                {t("dashboard.registro.pueblo")}
              </Label>
              <p>{formDataB.pue}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comu" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <p>{formDataB.comu}</p>
            </div>

            {/* Nuevos campos */}
            <div className="space-y-2">
              <Label htmlFor="longitud_cm" className="block">
                {t("dashboard.registro.longitud_cm")}
              </Label>
              <p>
                {formDataB.longitud_cm > 0
                  ? `${formDataB.longitud_cm} cm`
                  : t("dashboard.registro.no_data")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitud_m" className="block">
                {t("dashboard.registro.longitud_m")}
              </Label>
              <p>
                {formDataB.longitud_m > 0
                  ? `${formDataB.longitud_m} m`
                  : t("dashboard.registro.no_data")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso_kg" className="block">
                {t("dashboard.registro.peso_kg")}
              </Label>
              <p>
                {formDataB.peso_kg >= 0
                  ? `${formDataB.peso_kg} kg`
                  : t("dashboard.registro.no_data")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso_lb" className="block">
                {t("dashboard.registro.peso_lb")}
              </Label>
              <p>
                {formDataB.peso_lb >= 0
                  ? `${formDataB.peso_lb} lb`
                  : t("dashboard.registro.no_data")}
              </p>
            </div>

            {/* Datos remedir */}
            <div className="space-y-2">
              <Label htmlFor="rlongitud_cm" className="block">
                {t("dashboard.registro.rlongitud_cm")}
              </Label>
              <Select className="w-[280px]">
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${
                      formDataB.rlongitud_cm.length > 0
                        ? `${formDataB.rlongitud_cm[0]} cm`
                        : t("dashboard.registro.no_data")
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formDataB.rlongitud_cm.length > 0 ? (
                      formDataB.rlongitud_cm.map((value, index) => (
                        <SelectItem key={index} value={value}>
                          {value} cm
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        {t("dashboard.registro.no_data")}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rlongitud_m" className="block">
                {t("dashboard.registro.rlongitud_m")}
              </Label>
              <Select className="w-[280px]">
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${
                      formDataB.rlongitud_m.length > 0
                        ? `${formDataB.rlongitud_m[0]} m`
                        : t("dashboard.registro.no_data")
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formDataB.rlongitud_m.length > 0 ? (
                      formDataB.rlongitud_m.map((value, index) => (
                        <SelectItem key={index} value={value}>
                          {value} m
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        {t("dashboard.registro.no_data")}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rpeso_kg" className="block">
                {t("dashboard.registro.rpeso_kg")}
              </Label>
              <Select className="w-[280px]">
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${
                      formDataB.rpeso_kg.length > 0
                        ? `${formDataB.rpeso_kg[0]} kg`
                        : t("dashboard.registro.no_data")
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formDataB.rpeso_kg.length > 0 ? (
                      formDataB.rpeso_kg.map((value, index) => (
                        <SelectItem key={index} value={value}>
                          {value} kg
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        {t("dashboard.registro.no_data")}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rpeso_lb" className="block">
                {t("dashboard.registro.rpeso_lb")}
              </Label>
              <Select className="w-[280px]">
                <SelectTrigger>
                  <SelectValue
                    placeholder={`${
                      formDataB.rpeso_lb.length > 0
                        ? `${formDataB.rpeso_lb[0]} lb`
                        : t("dashboard.registro.no_data")
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {formDataB.rpeso_lb.length > 0 ? (
                      formDataB.rpeso_lb.map((value, index) => (
                        <SelectItem key={index} value={value}>
                          {value} lb
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>
                        {t("dashboard.registro.no_data")}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* End remedir */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
