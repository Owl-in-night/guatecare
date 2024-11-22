import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { format, parse, isDate } from "date-fns";
import { es } from "date-fns/locale"; // Para formatear en español
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
// Firebase
import { db } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom"; // para obtener el ID de la URL
import { Timestamp } from "firebase/firestore"; // Importa Timestamp para manejar fechas

export default function UpdateRegistro() {
  const { t } = useTranslation("global");
  const { id } = useParams();
  useEffect(() => {
    document.title = `${t("dashboard.navbar.editar")} | GuateCare`;
  }, [t]);
  // Estado para los datos
  const [formDataB, setFormDataB] = useState({
    gen: "",
    comunidadLinguistica: "",
    pueblo: "",
  });
  const [formDataE, setFormDataE] = useState({
    nameE: "",
    fechaNacimiento: "",
    dirr: "",
    fallecio: false,
    comunidadLing: "", // Asegúrate de que este campo esté inicializado
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [dateCreate, setDateCreate] = useState(null);
  const [encargadoId, setEncargadoId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Función para limpiar mensajes
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Cargar datos iniciales desde Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRefB = doc(db, "bebe", id);
        const docSnapB = await getDoc(docRefB);

        if (docSnapB.exists()) {
          const bebeData = docSnapB.data();
          setFormDataB({
            gen: bebeData.genero ? "male" : "famale",
            comunidadLinguistica: bebeData.comunidadLinguistica || "",
            pueblo: bebeData.pueblo || "",
          });
          setEncargadoId(bebeData.encargadoId); // Almacena encargadoId en el estado

          const docRefE = doc(db, "encargado", bebeData.encargadoId);
          const docSnapE = await getDoc(docRefE);

          if (docSnapE.exists()) {
            const encargadoData = docSnapE.data();
            setFormDataE({
              nameE: encargadoData.nombreEncargado || "",
              fechaNacimiento: encargadoData.fechaNacimiento || "",
              dirr: encargadoData.direccion || "",
              fallecio: encargadoData.fallecio || false,
              comunidadLing: encargadoData.comunidadLinguistica || "",
            });
            // Convertir timestamp a fecha
            if (encargadoData.fechaNacimiento instanceof Timestamp) {
              const date = encargadoData.fechaNacimiento.toDate(); // Convierte el timestamp a Date
              setDateCreate(date);
            }
          } else {
            setError(t("dashboard.registro.encargadoNotFound"));
            setTimeout(clearMessages, 10000); // Limpia el mensaje después de 10 segundos
          }
        } else {
          setError(t("dashboard.registro.bebeNotFound"));
          setTimeout(clearMessages, 10000); // Limpia el mensaje después de 10 segundos
        }
      } catch (error) {
        // console.error("Error obteniendo los datos:", error);
        setError(t("dashboard.registro.errorLoading"));
        setTimeout(clearMessages, 10000); // Limpia el mensaje después de 10 segundos
      }
    };
    fetchData();
  }, [id, t]);

  // Manejar cambio de fecha en el calendario
  useEffect(() => {
    if (dateCreate) {
      setSelectedMonth(dateCreate.getMonth());
      setSelectedYear(dateCreate.getFullYear());
      setFormDataE((prevData) => ({
        ...prevData,
        fechaNacimiento: dateCreate.toISOString(),
      }));
    }
  }, [dateCreate]);

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    if (dateCreate) {
      const updatedDate = new Date(dateCreate);
      updatedDate.setMonth(value);
      setDateCreate(updatedDate);
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    if (dateCreate) {
      const updatedDate = new Date(dateCreate);
      updatedDate.setFullYear(value);
      setDateCreate(updatedDate);
    }
  };

  const handleDateChange = (date) => {
    setDateCreate(date);
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
  };

  // Función para actualizar todos los datos
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRefB = doc(db, "bebe", id);
      await updateDoc(docRefB, {
        genero: formDataB.gen === "male",
        comunidadLinguistica: formDataB.comunidadLinguistica || "",
        pueblo: formDataB.pueblo || "",
      });

      if (encargadoId) {
        const docRefE = doc(db, "encargado", encargadoId);
        await updateDoc(docRefE, {
          nombreEncargado: formDataE.nameE,
          fechaNacimiento: Timestamp.fromDate(
            new Date(formDataE.fechaNacimiento)
          ),
          direccion: formDataE.dirr,
          fallecio: formDataE.fallecio,
          comunidadLing: formDataE.comunidadLing || "",
        });
      }

      setSuccess(t("dashboard.registro.updateSuccess"));
      setError("");
      setTimeout(clearMessages, 10000); // Limpia el mensaje de éxito después de 10 segundos
    } catch (error) {
      // console.error("Error actualizando el documento:", error);
      setError(t("dashboard.registro.errorUpdating"));
      setSuccess("");
      setTimeout(clearMessages, 10000); // Limpia el mensaje de error después de 10 segundos
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("dashboard.edit.title")}
          </CardTitle>
          <CardDescription>{t("dashboard.edit.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameE">{t("dashboard.registro.name")}</Label>
              <Input
                id="nameE"
                type="text"
                name="nameE"
                placeholder={t("dashboard.registro.description2")}
                value={formDataE.nameE}
                onChange={(e) =>
                  setFormDataE({ ...formDataE, nameE: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="born" className="block">
                {t("dashboard.registro.born")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-auto justify-start text-left font-normal",
                      !dateCreate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateCreate ? (
                      format(dateCreate, "dd-MM-yyyy")
                    ) : (
                      <span>dd/mm/yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1 mr-2">
                        <Label>{t("dashboard.registro.month")}</Label>
                        <Select
                          onValueChange={handleMonthChange}
                          value={selectedMonth}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t("dashboard.registro.month")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={i}>
                                {format(new Date(0, i), "MMMM")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1">
                        <Label>{t("dashboard.registro.year")}</Label>
                        <Select
                          onValueChange={handleYearChange}
                          value={selectedYear}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un año" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={new Date().getFullYear() - i}
                              >
                                {new Date().getFullYear() - i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Calendar
                      mode="single"
                      selected={dateCreate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dirr" className="block">
                {t("dashboard.registro.description3")}
              </Label>
              <Input
                id="dirr"
                type="text"
                name="dirr"
                placeholder={t("dashboard.registro.direction")}
                value={formDataE.dirr} // Enlazar con el estado
                onChange={
                  (e) => setFormDataE({ ...formDataE, dirr: e.target.value }) // Actualizar el estado
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallecio" className="block">
                {t("dashboard.registro.fallecio")}
              </Label>
              <Select
                id="fallecio"
                name="fallecio"
                onValueChange={
                  (value) =>
                    setFormDataE({ ...formDataE, fallecio: value === "yes" }) // Convertir a booleano
                }
                value={formDataE.fallecio ? "yes" : "no"} // Ajusta el valor para el Select
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.falleciop")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">
                    {t("dashboard.registro.yes")}
                  </SelectItem>
                  <SelectItem value="no">
                    {t("dashboard.registro.no")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comunidadLing" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <Select
                id="comunidadLing"
                name="comunidadLing"
                onValueChange={
                  (value) =>
                    setFormDataE({ ...formDataE, comunidadLing: value }) // Actualiza el estado
                }
                value={formDataE.comunidadLing} // Asegúrate de que este valor se inicializa correctamente
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.selectCommunity")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achi'">Achi'</SelectItem>
                  <SelectItem value="Akateka">Akateka</SelectItem>
                  <SelectItem value="Awakateka">Awakateka</SelectItem>
                  <SelectItem value="Ch'orti'">Ch'orti'</SelectItem>
                  <SelectItem value="Chalchiteka">Chalchiteka</SelectItem>
                  <SelectItem value="Chuj">Chuj</SelectItem>
                  <SelectItem value="Itza'">Itza'</SelectItem>
                  <SelectItem value="Ixil">Ixil</SelectItem>
                  <SelectItem value="Jakalteka">Jakalteka</SelectItem>
                  <SelectItem value="Kaqchikel">Kaqchikel</SelectItem>
                  <SelectItem value="K'iche'">K'iche'</SelectItem>
                  <SelectItem value="Mam'">Mam'</SelectItem>
                  <SelectItem value="Mopan">Mopan</SelectItem>
                  <SelectItem value="Poqomam">Poqomam</SelectItem>
                  <SelectItem value="Pocomchi'">Pocomchi'</SelectItem>
                  <SelectItem value="Q'anjob'al">Q'anjob'al</SelectItem>
                  <SelectItem value="Q'eqchi'">Q'eqchi'</SelectItem>
                  <SelectItem value="Sakapulteka">Sakapulteka</SelectItem>
                  <SelectItem value="Sipakapensa">Sipakapensa</SelectItem>
                  <SelectItem value="Tektiteka">Tektiteka</SelectItem>
                  <SelectItem value="Tz'utujil">Tz'utujil</SelectItem>
                  <SelectItem value="Uspanteka">Uspanteka</SelectItem>
                  <SelectItem value={t("dashboard.registro.ni")}>
                    No indica
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bebe */}
            <div className="space-y-2"></div>
            <CardDescription>
              {t("dashboard.edit.description2")}
            </CardDescription>
            <div className="space-y-2"></div>
            <div className="space-y-2">
              <Label htmlFor="gen">{t("dashboard.registro.genere")}</Label>
              <Select
                id="gen"
                onValueChange={(value) =>
                  setFormDataB({ ...formDataB, gen: value })
                }
                value={formDataB.gen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    {t("dashboard.registro.male")}
                  </SelectItem>
                  <SelectItem value="famale">
                    {t("dashboard.registro.famale")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pueblo" className="block">
                {t("dashboard.registro.pueblo")}
              </Label>
              <Select
                id="pueblo"
                name="pueblo"
                onValueChange={
                  (value) => setFormDataB({ ...formDataB, pueblo: value }) // Cambiar "pue" por "pueblo"
                }
                value={formDataB.pueblo || ""} // Asegúrate de que este valor se inicializa correctamente
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.pueblodesc")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ladino">Ladino</SelectItem>
                  <SelectItem value="Maya">Maya</SelectItem>
                  <SelectItem value="Garifuna">Garifuna</SelectItem>
                  <SelectItem value="Xinca">Xinca</SelectItem>
                  <SelectItem value={t("dashboard.registro.others")}>
                    {t("dashboard.registro.others")}
                  </SelectItem>
                  <SelectItem value={t("dashboard.registro.na")}>
                    {t("dashboard.registro.na")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comu" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <Select
                id="comu"
                name="comu"
                onValueChange={
                  (value) =>
                    setFormDataB({ ...formDataB, comunidadLinguistica: value }) // Cambia 'comu' de nuevo si es necesario
                }
                value={formDataB.comunidadLinguistica} // Asegúrate de que el valor correcto esté ligado
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.selectCommunity")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achi'">Achi'</SelectItem>
                  <SelectItem value="Akateka">Akateka</SelectItem>
                  <SelectItem value="Awakateka">Awakateka</SelectItem>
                  <SelectItem value="Ch'orti'">Ch'orti'</SelectItem>
                  <SelectItem value="Chalchiteka">Chalchiteka</SelectItem>
                  <SelectItem value="Chuj">Chuj</SelectItem>
                  <SelectItem value="Itza'">Itza'</SelectItem>
                  <SelectItem value="Ixil">Ixil</SelectItem>
                  <SelectItem value="Jakalteka">Jakalteka</SelectItem>
                  <SelectItem value="Kaqchikel">Kaqchikel</SelectItem>
                  <SelectItem value="K'iche'">K'iche'</SelectItem>
                  <SelectItem value="Mam'">Mam'</SelectItem>
                  <SelectItem value="Mopan">Mopan</SelectItem>
                  <SelectItem value="Poqomam">Poqomam</SelectItem>
                  <SelectItem value="Pocomchi'">Pocomchi'</SelectItem>
                  <SelectItem value="Q'anjob'al">Q'anjob'al</SelectItem>
                  <SelectItem value="Q'eqchi'">Q'eqchi'</SelectItem>
                  <SelectItem value="Sakapulteka">Sakapulteka</SelectItem>
                  <SelectItem value="Sipakapensa">Sipakapensa</SelectItem>
                  <SelectItem value="Tektiteka">Tektiteka</SelectItem>
                  <SelectItem value="Tz'utujil">Tz'utujil</SelectItem>
                  <SelectItem value="Uspanteka">Uspanteka</SelectItem>
                  <SelectItem value={t("dashboard.registro.ni")}>
                    No indica
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">{t("dashboard.edit.update")}</Button>
          </form>
        </CardContent>
      </Card>
      <img
        alt="GuateCare"
        src="/img/update.png"
        className="w-80 md:w-1/3 object-cover mb-4 md:mb-0 md:mr-4"
      />
    </div>
  );
}
