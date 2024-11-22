import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Community() {
  const { t } = useTranslation("global");
  useEffect(() => {
    document.title = `${t("support.page.title5")} | GuateCare`;
  }, [t]);
  return (
    <>
      <NavbarSupport />
      <div className="bg-white py-24 sm:py-32 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-amber-950 text-center text-lg font-semibold leading-8">
            {t("commuty.thanks")}
          </h2>
          <div className="mx-auto mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {[
              "/img/logo4.png",
              "/img/logo2.png",
              "/img/logo3.png",
              "/img/logo7.png",
              "/img/logo8.png",
              "/img/logo1.png",
              "/img/logo5.png",
              "/img/logo6.png",
            ].map((src, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={src}
                  alt={`Logo ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Community;
