import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Createditar() {
  const { t } = useTranslation("global");

  useEffect(() => {
    document.title = `${t("support.page.title2")} | GuateCare`;
  }, [t]);

  return (
    <>
      <NavbarSupport />
      <div className="overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Primer bloque: texto a la izquierda, imagen a la derecha */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  {t("ce.create")}
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("ce.create2")}
                </p>
                <p className="mt-6 text-lg leading-8">{t("ce.create3")}</p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900"></dt>
                    <dd className="inline"></dd>
                  </div>
                </dl>
              </div>
            </div>
            <img
              src="/public/img/creardatos.PNG"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </div>

          {/* Segundo bloque: imagen a la izquierda, texto a la derecha */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 mt-16">
            <img
              src="/public/img/visualizar.PNG" // Cambia la ruta si es necesario
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-72 lg:-mr-0"
            />
            <div className="lg:pl-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  {t("ce.view")}
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("ce.view2")}
                </p>
                <p className="mt-6 text-lg leading-8">{t("ce.view3")}</p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900"></dt>
                    <dd className="inline"></dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Createditar;
