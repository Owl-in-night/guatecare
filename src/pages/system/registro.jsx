import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//Firebase
import { db } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function Registro() {
  const { t } = useTranslation("global");

  useEffect(() => {
    document.title = `${t("dashboard.navbar.register2")} | GuateCare`;
  }, [t]);
  //Forms 1
  const [formData, setFormData] = useState({
    dpi: "",
    nameE: "",
    born: "",
    dirr: "",
    tel: "",
    fallecio: "",
    comunidadLing: "",
  });
  //Forms 2
  const [formDataB, setFormDataB] = useState({
    cui: "",
    nameb: "",
    born2: "",
    dirrl: "",
    gen: "",
    pue: "",
    comu: "",
    measurementId: null, // Nuevo campo para almacenar el ID de la medición
  });

  //Date form 1
  const [dateCreate, setDateCreate] = useState();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorB, setErrorB] = useState("");
  const [successB, setSuccessB] = useState("");

  const [measurements, setMeasurements] = useState([]);

  // Obtener la colección "measurements" desde Firebase
  useEffect(() => {
    const fetchMeasurements = async () => {
      // Obtener las mediciones de Firebase
      const querySnapshot = await getDocs(collection(db, "measurements"));
      const measurementList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener los registros de la colección "bebe"
      const bebeSnapshot = await getDocs(collection(db, "bebe"));
      const usedMeasurementIds = bebeSnapshot.docs.map(
        (doc) => doc.data().measurementId
      );

      // Filtrar mediciones que ya están vinculadas
      const availableMeasurements = measurementList.filter(
        (measurement) => !usedMeasurementIds.includes(measurement.id)
      );

      setMeasurements(availableMeasurements);
    };

    fetchMeasurements();
  }, []);

  const handleYearChange = (value) => {
    const newYear = parseInt(value, 10);
    setSelectedYear(newYear);
    setDateCreate((prevDate) => {
      if (prevDate) {
        return new Date(newYear, prevDate.getMonth(), prevDate.getDate());
      } else {
        return new Date(newYear, 0, 1);
      }
    });
  };
  //Date form 2
  const handleMonthChange = (value) => {
    const newMonth = parseInt(value, 10);
    setSelectedMonth(newMonth);
    setDateCreate((prevDate) => {
      if (prevDate) {
        return new Date(prevDate.getFullYear(), newMonth, prevDate.getDate());
      } else {
        return new Date(new Date().getFullYear(), newMonth, 1);
      }
    });
  };
  //Date form 1
  const handleDateChange = (date) => {
    setDateCreate(date);
    if (date) {
      // Guardar la fecha formateada en el estado del formulario
      setFormData({ ...formData, born: format(date, "yyyy-MM-dd") }); // O el formato que prefieras
    } else {
      // Limpiar el campo si no hay fecha seleccionada
      setFormData({ ...formData, born: "" });
    }
  };
  //End date

  //Date2
  const [dateCreateB, setDateCreateB] = useState();
  const [selectedYearB, setSelectedYearB] = useState(new Date().getFullYear());
  const [selectedMonthB, setSelectedMonthB] = useState(new Date().getMonth());

  const handleYearChangeB = (value) => {
    const newYearB = parseInt(value, 10);
    setSelectedYearB(newYearB);
    setDateCreateB((prevDate) => {
      if (prevDate) {
        return new Date(newYearB, prevDate.getMonth(), prevDate.getDate());
      } else {
        return new Date(newYearB, 0, 1);
      }
    });
  };

  const handleMonthChangeB = (value) => {
    const newMonthB = parseInt(value, 10);
    setSelectedMonthB(newMonthB);
    setDateCreateB((prevDate) => {
      if (prevDate) {
        return new Date(prevDate.getFullYear(), newMonthB, prevDate.getDate());
      } else {
        return new Date(new Date().getFullYear(), newMonthB, 1);
      }
    });
  };

  const handleDateChangeB = (date) => {
    setDateCreateB(date);
    if (date) {
      // Guardar la fecha formateada en el estado del formulario
      setFormDataB({ ...formDataB, born2: format(date, "yyyy-MM-dd") }); // O el formato que prefieras
    } else {
      // Limpiar el campo si no hay fecha seleccionada
      setFormDataB({ ...formDataB, born2: "" });
    }
  };
  //End date2

  const formatPhone = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    const limitedValue = cleanValue.slice(0, 8);
    if (limitedValue.length <= 4) return limitedValue;
    return `${limitedValue.slice(0, 4)}-${limitedValue.slice(4)}`;
  };

  //dpi
  const formatdpi = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 4) return cleanValue;
    if (cleanValue.length <= 9)
      return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
    return `${cleanValue.slice(0, 4)} ${cleanValue.slice(
      4,
      9
    )} ${cleanValue.slice(9, 13)}`;
  };

  //CUI
  const formatcui = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 4) return cleanValue;
    if (cleanValue.length <= 9)
      return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
    return `${cleanValue.slice(0, 4)} ${cleanValue.slice(
      4,
      9
    )} ${cleanValue.slice(9, 13)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tel") {
      const formattedPhone = formatPhone(value);
      setFormData({ ...formData, [name]: formattedPhone });
    } else if (name === "dpi") {
      const formatteddpi = formatdpi(value);
      setFormData({ ...formData, [name]: formatteddpi });

      const regex = /^\d{4} \d{5} \d{4}$/;
      if (formatteddpi && !regex.test(formatteddpi)) {
        setError(t("dashboard.registro.dpiError"));
      } else {
        setError("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //HandleChange Baby
  const handleChangeB = (e) => {
    const { name, value } = e.target;

    if (name === "cui") {
      const formattedcui = formatcui(value);
      setFormDataB({ ...formDataB, [name]: formattedcui });

      const regex = /^\d{4} \d{5} \d{4}$/;
      if (formattedcui && !regex.test(formattedcui)) {
        setErrorB(t("dashboard.registro.dpiError"));
      } else {
        setErrorB("");
      }
    } else {
      setFormDataB({ ...formDataB, [name]: value });
    }
  };

  //Base de datos

  const formatDate = (date) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(
      date
    );

    // Cambiar el formato a "DD/MM/YYYY hh:mm AM/PM"
    const [datePart, timePart] = formattedDate.split(", ");
    const [day, month, year] = datePart.split("/");
    return `${day}/${month}/${year} ${timePart}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setErrorB("");
    setSuccessB("");
  
    // Validar que todos los campos requeridos están llenos
    const requiredFieldsForm1 = ["dpi", "nameE", "born", "dirr", "tel", "fallecio", "comunidadLing"];
    const requiredFieldsForm2 = ["cui", "nameb", "born2", "dirrl", "gen", "pue", "comu", "measurementId"];
  
    for (const field of requiredFieldsForm1) {
      if (!formData[field]) {
        setError(t("donar.none"));
        return;
      }
    }
  
    for (const field of requiredFieldsForm2) {
      if (!formDataB[field]) {
        setErrorB(t("donar.none"));
        return;
      }
    }
  
    if (!dateCreate || !dateCreateB) {
      setError(t("dashboard.registro.dateError"));
      return;
    }
  
    const phoneWithoutFormat = formData.tel.replace("-", "");
    const formattedPhone = `(+502) ${phoneWithoutFormat.slice(0, 4)}-${phoneWithoutFormat.slice(4)}`;
  
    try {
      const encargadoDocRef = await addDoc(collection(db, "encargado"), {
        dpi: formData.dpi,
        nombreEncargado: formData.nameE,
        direccion: formData.dirr,
        telefono: formattedPhone,
        fechaNacimiento: dateCreate,
        fallecio: formData.fallecio === t("dashboard.registro.yes"),
        comunidadLinguistica: formData.comunidadLing,
      });
  
      let measurementId = formDataB.measurementId;
  
      // Guardar en Firebase para el formulario 2
      await addDoc(collection(db, "bebe"), {
        cui: formDataB.cui,
        nombrebebe: formDataB.nameb,
        lugar: formDataB.dirrl,
        fechaNacimiento: dateCreateB,
        genero: formDataB.gen === t("dashboard.registro.male"),
        comunidadLinguistica: formDataB.comu,
        pueblo: formDataB.pue,
        encargadoId: encargadoDocRef.id,
        measurementId: measurementId,
        createdAt: formatDate(new Date()),
      });
  
      // Actualizar lista de mediciones disponibles eliminando la que se usó
      setMeasurements(prevMeasurements =>
        prevMeasurements.filter(measurement => measurement.id !== measurementId)
      );
  
      setSuccess(t("dashboard.registro.successMessage"));
      setTimeout(() => {
        setSuccess("");
      }, 10000);
  
      // Resetear los formularios y el estado
      setFormData({
        dpi: "",
        nameE: "",
        born: "",
        tel: "",
        dirr: "",
        fallecio: "",
        comunidadLing: "",
      });
      setFormDataB({
        cui: "",
        nameb: "",
        born2: "",
        dirrl: "",
        gen: "",
        pue: "",
        comu: "",
        measurementId: null, // Resetear el campo measurementId
      });
      setDateCreate(undefined);
      setDateCreateB(undefined);
      setSelectedYear(new Date().getFullYear());
      setSelectedMonth(new Date().getMonth());
      setSelectedYearB(new Date().getFullYear());
      setSelectedMonthB(new Date().getMonth());
    } catch (error) {
      setError(t("dashboard.registro.errorMessage"));
    }
  };
  
  // console.log("formData:", formData);
  // console.log("formDataB:", formDataB);
  // console.log("dateCreateB:", dateCreateB);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8">
      {/* Forms 1 */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("dashboard.registro.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.registro.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="measurementId"
                className="block text-sm font-medium"
              >
                {t("dashboard.registro.selectMeasurement")}
              </label>
              <Select
                id="measurementId"
                name="measurementId"
                onValueChange={(value) =>
                  setFormDataB({ ...formDataB, measurementId: value })
                }
                value={formDataB.measurementId || ""}
              >
                <SelectTrigger className="w-full mt-1  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <SelectValue placeholder={t("dashboard.registro.selectM")} />
                </SelectTrigger>
                <SelectContent>
                  {measurements.length > 0 ? (
                    measurements.map((measurement) => (
                      <SelectItem key={measurement.id} value={measurement.id}>
                        {measurement.nombreMedicion || `${measurement.id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>
                      {t("dashboard.registro.noMeasurementsAvailable")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpi" className="block">
                {t("dashboard.registro.dpi")}
              </Label>
              <Input
                id="dpi"
                type="text"
                name="dpi"
                placeholder={t("dashboard.registro.description1")}
                value={formData.dpi}
                onChange={handleChange}
                maxLength={15} // Máximo 15 caracteres para incluir espacios
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameE" className="block">
                {t("dashboard.registro.name")}
              </Label>
              <Input
                id="nameE"
                type="text"
                name="nameE"
                placeholder={t("dashboard.registro.description2")}
                value={formData.nameE}
                onChange={handleChange}
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
                            <SelectValue placeholder="Selecciona un mes" />
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
                      defaultMonth={new Date(selectedYear, selectedMonth, 1)}
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
                value={formData.dirr}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tel" className="block">
                {t("dashboard.registro.description4")}
              </Label>
              <Input
                id="tel"
                type="text"
                name="tel"
                placeholder="Ingrese su número de teléfono"
                value={formData.tel}
                onChange={handleChange}
                maxLength={9}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallecio" className="block">
                {t("dashboard.registro.fallecio")}
              </Label>
              <Select
                id="fallecio"
                name="fallecio"
                onValueChange={(value) =>
                  setFormData({ ...formData, fallecio: value })
                }
                value={formData.fallecio}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.falleciop")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={t("dashboard.registro.yes")}>
                    {t("dashboard.registro.yes")}
                  </SelectItem>
                  <SelectItem value={t("dashboard.registro.no")}>
                    {t("dashboard.registro.no")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comunidada 1 */}
            <div className="space-y-2">
              <Label htmlFor="comunidadLing" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <Select
                id="comunidadLing"
                name="comunidadLing"
                onValueChange={(value) =>
                  setFormData({ ...formData, comunidadLing: value })
                }
                value={formData.comunidadLing}
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

            {/* <div className="space-y-2">
              <Button type="submit" className="w-full ">
                {t("dashboard.buttons.save")}
              </Button>
            </div> */}
          </form>
        </CardContent>
      </Card>

      <img
        alt="GuateCare"
        src="/img/registro.png"
        className="w-80 md:w-1/3 object-cover mb-4 md:mb-0 md:mr-4"
      />

      {/* Forms 2 */}
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("dashboard.registro.title2")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.registro.description5")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* {errorB && <p className="text-red-500">{errorB}</p>}
          {successB && <p className="text-green-500">{successB}</p>} */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cui" className="block">
                {t("dashboard.registro.cui")}
              </Label>
              <Input
                id="cui"
                type="text"
                name="cui"
                placeholder={t("dashboard.registro.description6")}
                value={formDataB.cui}
                onChange={handleChangeB}
                maxLength={15} // Máximo 15 caracteres para incluir espacios
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameb" className="block">
                {t("dashboard.registro.name2")}
              </Label>
              <Input
                id="nameb"
                type="text"
                name="nameb"
                placeholder={t("dashboard.registro.description2")}
                value={formDataB.nameb}
                onChange={handleChangeB}
              />
            </div>
            {/* Born baby */}
            <div className="space-y-2">
              <Label htmlFor="born2" className="block">
                {t("dashboard.registro.born2")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-auto justify-start text-left font-normal",
                      !dateCreateB && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateCreateB ? (
                      format(dateCreateB, "dd-MM-yyyy")
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
                          onValueChange={handleMonthChangeB}
                          value={selectedMonthB}
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
                          onValueChange={handleYearChangeB}
                          value={selectedYearB}
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
                      selected={dateCreateB}
                      onSelect={handleDateChangeB}
                      initialFocus
                      defaultMonth={new Date(selectedYearB, selectedMonthB, 1)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dirrl" className="block">
                {t("dashboard.registro.directionborn")}
              </Label>
              <Input
                id="dirrl"
                type="text"
                name="dirrl"
                placeholder={t("dashboard.registro.direction")}
                value={formDataB.dirrl}
                onChange={handleChangeB}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genere" className="block">
                {t("dashboard.registro.genere")}
              </Label>
              <Select
                id="genere"
                name="genere"
                onValueChange={(value) =>
                  setFormDataB({ ...formDataB, gen: value })
                }
                value={formDataB.gen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.registro.generedesc")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={t("dashboard.registro.male")}>
                    {t("dashboard.registro.male")}
                  </SelectItem>
                  <SelectItem value={t("dashboard.registro.famale")}>
                    {t("dashboard.registro.famale")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pueblo */}
            <div className="space-y-2">
              <Label htmlFor="pueblo" className="block">
                {t("dashboard.registro.pueblo")}
              </Label>
              <Select
                id="pueblo"
                name="pueblo"
                onValueChange={(value) =>
                  setFormDataB({ ...formDataB, pue: value })
                }
                value={formDataB.pue}
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
            {/* Nuevo select para la comunidad lingüística */}
            <div className="space-y-2">
              <Label htmlFor="comu" className="block">
                {t("dashboard.registro.comunidadLing")}
              </Label>
              <Select
                id="comu"
                name="comu"
                onValueChange={(value) =>
                  setFormDataB({ ...formDataB, comu: value })
                }
                value={formDataB.comu}
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

            <div className="space-y-2">
              <Button type="submit" className="w-full ">
                {t("dashboard.buttons.save")}
              </Button>
            </div>
          </form>
          {/* Forms 2 */}
        </CardContent>
      </Card>
    </div>
  );
}
