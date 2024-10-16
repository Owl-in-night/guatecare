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
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-8 sm:max-w-xl lg:max-w-none lg:grid-cols-3">
            <img
              src="/img/logo4.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo2.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo3.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo7.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo8.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo1.png"
              className="max-h-auto w-full object-contain"
            />

            <img
              src="/img/logo5.png"
              className="max-h-auto w-full object-contain"
            />
            <img
              src="/img/logo6.png"
              className="max-h-auto w-full object-contain"
            />
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Community;
