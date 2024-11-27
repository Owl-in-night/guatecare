import { useEffect } from "react";
import {
  ArrowBigDownDash,
  BookOpen,
  ChartLine,
  CircleFadingArrowUp,
} from "lucide-react"; // Si no usas otros íconos, puedes eliminar los import innecesarios
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { useState } from "react";
function Home() {
  const [t, i18n] = useTranslation("global");


  const [key, setKey] = useState(Date.now()); // Usar un estado para forzar la actualización

  useEffect(() => {
    // Cada vez que cambie el idioma, reiniciar el key para el Typewriter
    setKey(Date.now());
  }, [i18n.language]); // Cambia el key cuando se cambia el idioma

  useEffect(() => {
    document.title = `${t("navbar.home")} | GuateCare`;
  }, [t]);

  // Función para desplazarse suavemente hacia la sección deseada
  const scrollToSection = (e, sectionId) => {
    e.preventDefault(); // Evita el comportamiento por defecto del <a>
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth", // Desplazamiento suave
        block: "start", // Desplazarse al principio de la sección
      });
    }
  };

  return (
    <div id="section0" className="">
      {/* Sección principal con fondo blanco */}
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          {/* Sección de texto principal con título y descripción */}
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            {/* <h1 className="text-balance text-5xl xl:text-7xl lg:text-7xl font-semibold tracking-tight sm:text-4xl">
              {t("mainhome.work")}
              <span className="font-bold text-5xl xl:text-7xl lg:text-7xl">
                G
              </span>
              <span className="font-bold text-5xl xl:text-7xl lg:text-7xl text-[#01a89e]">
                uate
              </span>
              <span className="font-bold text-5xl xl:text-7xl lg:text-7xl">
                C
              </span>
              <span className="font-bold text-5xl xl:text-7xl lg:text-7xl text-[#01a89e]">
                are
              </span>
              {t("mainhome.work2")}
            </h1> */}
           <h1 className="text-balance text-5xl xl:text-7xl lg:text-7xl font-semibold tracking-tight sm:text-4xl">
      <Typewriter
        key={key} // Reinicia el componente cada vez que cambia el idioma
        onInit={(typewriter) => {
          typewriter
            .typeString(`${t("mainhome.work")} `)
            .typeString(
              `<span class="font-bold text-5xl xl:text-7xl lg:text-7xl">G</span>`
            )
            .typeString(
              `<span class="font-bold text-5xl xl:text-7xl lg:text-7xl text-[#01a89e]">uate</span>`
            )
            .typeString(
              `<span class="font-bold text-5xl xl:text-7xl lg:text-7xl">C</span>`
            )
            .typeString(
              `<span class="font-bold text-5xl xl:text-7xl lg:text-7xl text-[#01a89e]">are</span>`
            )
            .typeString(`${t("mainhome.work2")}`)
            .pauseFor(2500)
            .start();
        }}
        options={{
          cursor: "|", // Personaliza el cursor
          delay: 75, // Velocidad de escritura
        }}
      />
    </h1>

            <p className="mt-6 text-pretty text-2xl lg:text-3xl font-light leading-relaxed text-center sm:text-left max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
              {t("mainhome.workdesc")}
            </p>

            {/* Botones de acción */}
            <div className="mt-10 flex items-center justify-center gap-x-10 lg:justify-start">
              <Link
                to={`/Estadísticas`}
                className="flex items-center bg-indigo-600 text-white hover:bg-indigo-500 rounded-md px-3.5 py-2.5 text-lg font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ChartLine className="mr-2" />
                {t("mainhome.button1")}
              </Link>
              <a
                href="#section1"
                onClick={(e) => scrollToSection(e, "section1")}
                className="flex items-center text-lg font-semibold"
              >
                {t("mainhome.button2")}
                <span aria-hidden="true" className="ml-2">
                  <ArrowBigDownDash />
                </span>
              </a>
            </div>
          </div>

          {/* Sección de imágenes con modo claro y oscuro */}
          <div className="relative mt-16 h-80 lg:mt-8">
            {/* Imagen para el modo claro */}
            <img
              src="/img/white.png"
              width={1824}
              height={1080}
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md dark:hidden" // Se oculta en el modo oscuro
            />
            {/* Imagen para el modo oscuro */}
            <img
              alt="App screenshot"
              src="/img/black.png"
              width={1824}
              height={1080}
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md hidden dark:block" // Se oculta en el modo claro
            />
          </div>
        </div>
      </div>

      {/* Sección 1 */}
      <div
        id="section1"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        {/* Contenido adicional */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto adicional */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base/7 font-semibold text-indigo-600">
                  {t("mainhome.title1")}
                </p>
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.title")}
                </h1>
                <p className="mt-6 text-xl/8">{t("mainhome.intro")}</p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/def.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles adicionales */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <p>{t("mainhome.details.causes")}</p>
                <ul role="list" className="mt-8 space-y-8 ">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.risk_factors")}
                      </strong>{" "}
                      {t("mainhome.details.causes")}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.symptoms")}
                      </strong>{" "}
                      {t("mainhome.details.causes")}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.treatment")}
                      </strong>{" "}
                      {t("mainhome.details.causes")}
                    </span>
                  </li>
                </ul>
                <p className="mt-8">{t("mainhome.details.prevention")}</p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight ">
                  {t("mainhome.prevention_title")}
                </h2>
                <p className="mt-6">{t("mainhome.details.prevention")}</p>
                <a
                  href="#section2"
                  onClick={(e) => scrollToSection(e, "section2")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.readmore")}
                  <BookOpen className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section2 */}
      <div
        id="section2"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.acuteMalnutrition.subtitle")}
                </h1>
                <p className="mt-6 text-xl/8">
                  {t("mainhome.acuteMalnutrition.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt=""
              src="/img/tipos.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.types.marasmus.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.types.marasmus.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.types.kwashiorkor.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.types.kwashiorkor.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.types.mixed.title")}:
                      </strong>{" "}
                      {t("mainhome.acuteMalnutrition.types.mixed.description")}
                    </span>
                  </li>
                </ul>
                {/* <h2 className="mt-8 text-2xl font-bold">
                  {t("mainhome.acuteMalnutrition.prevention.title")}
                </h2> */}
                {/* <p className="mt-4">
                  {t("mainhome.acuteMalnutrition.prevention.description")}
                </p> */}
                <h2 className="mt-8 text-2xl font-bold">
                  {t("mainhome.acuteMalnutrition.impact.title")}
                </h2>
                <p className="mt-4">
                  {t("mainhome.acuteMalnutrition.impact.description")}
                </p>
                <a
                  href="#section3"
                  onClick={(e) => scrollToSection(e, "section3")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.readmore")}
                  <BookOpen className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section3 */}
      <div
        id="section3"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.acuteMalnutrition.causes.title")}
                </h1>
                <p className="mt-6 text-xl/8">
                  {t("mainhome.acuteMalnutrition.causes.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt="Causas de la desnutrición aguda"
              src="/img/causas.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.causes.poverty.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.poverty.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.causes.conflict.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.conflict.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.causes.disease.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.disease.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.causes.ignorance.title")}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.ignorance.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.causes.healthcare.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.healthcare.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.causes.maternal.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.causes.maternal.description"
                      )}
                    </span>
                  </li>
                </ul>
                <a
                  href="#section4"
                  onClick={(e) => scrollToSection(e, "section4")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.readmore")}
                  <BookOpen className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section4 */}
      <div
        id="section4"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.acuteMalnutrition.consequences.title")}
                </h1>
                <p className="mt-6 text-xl/8">
                  {t("mainhome.acuteMalnutrition.consequences.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt="Causas de la desnutrición aguda"
              src="/img/consecuencias.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.consequences.growth.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.consequences.growth.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.consequences.immunity.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.consequences.immunity.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.consequences.development.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.consequences.development.description"
                      )}
                    </span>
                  </li>
                </ul>
                <a
                  href="#section5"
                  onClick={(e) => scrollToSection(e, "section5")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.readmore")}
                  <BookOpen className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section5 */}
      <div
        id="section5"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.acuteMalnutrition.prevention.title")}
                </h1>
                <p className="mt-6 text-xl/8">
                  {t("mainhome.acuteMalnutrition.prevention.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt="Causas de la desnutrición aguda"
              src="/img/preve.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.prevention.lactancia.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.prevention.lactancia.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.prevention.diet.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.prevention.diet.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t(
                          "mainhome.acuteMalnutrition.prevention.healthcare.title"
                        )}
                        :
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.prevention.healthcare.description"
                      )}
                    </span>
                  </li>
                </ul>
                <a
                  href="#section6"
                  onClick={(e) => scrollToSection(e, "section6")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.readmore")}
                  <BookOpen className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section6 */}
      <div
        id="section6"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          {/* Sección de texto */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t("mainhome.acuteMalnutrition.impact.title")}
                </h1>
                <p className="mt-6 text-xl/8">
                  {t("mainhome.acuteMalnutrition.impact.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              src="/img/impacto.png"
              className="w-[48rem] max-w-none rounded-xl sm:w-[57rem]"
            />
          </div>

          {/* Sección de detalles */}
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.impact.social.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.impact.social.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.impact.economic.title")}:
                      </strong>{" "}
                      {t(
                        "mainhome.acuteMalnutrition.impact.economic.description"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold">
                        {t("mainhome.acuteMalnutrition.impact.human.title")}:
                      </strong>{" "}
                      {t("mainhome.acuteMalnutrition.impact.human.description")}
                    </span>
                  </li>
                </ul>
                <a
                  href="#section0"
                  onClick={(e) => scrollToSection(e, "section0")}
                  className="flex items-center text-lg font-semibold mt-4"
                >
                  {t("support.others.up")}
                  <CircleFadingArrowUp className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
