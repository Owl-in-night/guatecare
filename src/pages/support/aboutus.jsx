//

import {
  Binoculars,
  BookHeart,
  Presentation,
  Telescope,
  Trophy,
} from "lucide-react";
import { shaveFace } from "@lucide/lab";
import { Icon } from "lucide-react";

//History
// const links = [
//   { name: 'Open roles', href: '#' },
//   { name: 'Internship program', href: '#' },
//   { name: 'Our values', href: '#' },
//   { name: 'Meet our leadership', href: '#' },
// ]
// const stats = [
//   { name: "Offices worldwide", value: "12" },
//   { name: "Full-time colleagues", value: "300+" },
//   { name: "Hours per week", value: "40" },
//   { name: "Paid time off", value: "Unlimited" },
// ];

import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useTranslation } from "react-i18next";
function Aboutus() {
  const [t] = useTranslation("global");
  const people = [
    {
      name: "Santos Pedro Baltazar Joj Cano",
      role: t("about.developer"),
      imageUrl: "/public/img/dev.jpg",
    },
    // More people...
  ];
  return (
    <div>
      <NavbarSupport />
      {/* About */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
        />
        <div
          aria-hidden="true"
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t("about.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {t("about.description1")}
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  <Telescope className="h-6 w-6 mr-2" />
                  {t("about.mision")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.misiondesc")}
                </dd>
              </div>

              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  <BookHeart className="h-6 w-6 mr-2" />
                  {t("about.history")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.hisotydesc")}
                </dd>
              </div>

              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  <Presentation className="h-6 w-6 mr-2" />
                  {t("about.project")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.projectdesc")}
                </dd>
              </div>

              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  {" "}
                  <Icon className="h-6 w-6 mr-2" iconNode={shaveFace} />
                  {t("about.impact")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.impactdesc")}
                </dd>
              </div>

              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  <Trophy className="h-6 w-6 mr-2" />
                  {t("about.rewards")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.rewardsdesc")}
                </dd>
              </div>

              <div className="relative rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl ring-1 ring-gray-900/10">
                <dt className="text-base font-semibold leading-7 text-cyan-400 flex">
                  <Binoculars className="h-6 w-6 mr-2" />
                  {t("about.future")}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-300">
                  {t("about.futuredesc")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3 xl:mr-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("about.ourteam")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-slate-300">
              {t("about.ourteamdesc")}
            </p>
          </div>
          <ul
            role="list"
            className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
          >
            {people.map((person) => (
              <li
                key={person.name}
                className="flex flex-col items-center sm:flex-row sm:items-start"
              >
                <img
                  alt={`Imagen de ${person.name}`}
                  src={person.imageUrl}
                  className="h-80 w-50 md:h-80 md:w-80 lg:h-80 lg:w-80 xl:h-80 xl:w-80 2xl:h-80 2xl:w-80 rounded-md sm:mr-8"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-gray-200">
                    {person.name}
                  </h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">
                    {person.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* End Team */}
    </div>
  );
}

export default Aboutus;
