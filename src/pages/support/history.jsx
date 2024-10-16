import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
function HistoryA() {
  const [t] = useTranslation("global");
  useEffect(() => {
    document.title = `${t("support.page.title7")} | GuateCare`;
  }, [t]);
  return (
    <>
      <NavbarSupport />
      {/* Text */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                {t("history.title") }
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("history.description1")}
              </p>
            </div>
            <img
              src="/img/sm.png"
              alt="Imagen descriptiva"
              className="w-5/12 h-auto rounded-lg shadow-lg hidden md:block lg:block xl:block 2xl:block"
            />
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                {/* <time className="text-gray-500 dark:text-gray-400">
                  Sep 03, 2024
                </time> */}
                <h2
                  className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-900 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-100 hover:bg-gray-100"
                >
                  {t("history.project")}
                </h2>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  <span className="absolute inset-0"></span>
                  {t("history.solution")}
                </h3>
                <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                   {t("history.description2")}
                </p>
                
              </div>
              {/* <div className="relative mt-8 flex items-center gap-x-4">
                <img
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="h-10 w-10 rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    <a href="#">
                      <span className="absolute inset-0"></span>
                      Michael Foster
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Co-Founder / CTO
                  </p>
                </div>
              </div> */}
            </article>
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                {/* <time className="text-gray-500 dark:text-gray-400">
                  Sep 03, 2024
                </time> */}
                <h2

                  className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-900 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-100 hover:bg-gray-100"
                >
                    {t("history.impact")}
                </h2>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  <span className="absolute inset-0"></span>
                  {t("history.impact2")}
                </h3>
                <p className="mt-5  text-sm leading-6 text-gray-600 dark:text-gray-300">
                {t("history.description4")}
                </p>
                
              </div>
              {/* <div className="relative mt-8 flex items-center gap-x-4">
                <img
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="h-10 w-10 rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    <a href="#">
                      <span className="absolute inset-0"></span>
                      Jane Doe
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Project Lead
                  </p>
                </div>
              </div> */}
            </article>
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                {/* <time className="text-gray-500 dark:text-gray-400">
                  Sep 03, 2024
                </time> */}
                <h2
                  className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-900 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-100 hover:bg-gray-100"
                >
                  {t("history.reward")}
                </h2>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  <span className="absolute inset-0"></span>
                  {t("history.rf")}
                </h3>
                <p className="mt-5  text-sm leading-6 text-gray-600 dark:text-gray-300">
                {t("history.description5")}
                </p>
              </div>
              {/* <div className="relative mt-8 flex items-center gap-x-4">
                <img
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="h-10 w-10 rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    <a href="#">
                      <span className="absolute inset-0"></span>
                      Sarah Johnson
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Outreach Coordinator
                  </p>
                </div>
              </div> */}
            </article>
          </div>
        </div>
      </div>
      {/* EndText */}
    </>
  );
}

export default HistoryA;
