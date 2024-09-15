import { useState, useEffect } from "react";
import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useTranslation } from "react-i18next";
import emailjs from '@emailjs/browser';

function Donar() {
  const [t] = useTranslation("global");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar mail
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatusMessage({
        type: "error",
        text: t("donar.none"),
      });
      return;
    }

    // Configuración de EmailJS
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      to_name: 'Santos Pedro Baltazar Joj Cano',
      from_email: formData.email,
      message: formData.message,
    };

    emailjs.send('service_xw9e5bp', 'template_7l4zfbq', templateParams, 'TlqBmjkxT9eSiEEGq')
      .then((response) => {
        console.log('Email sent:', response);
        setStatusMessage({
          type: "success",
          text: t("donar.thanks"),
        });
      })
      .catch((error) => {
        console.log('Error:', error);
        setStatusMessage({
          type: "error",
          text: t("donar.error"),
        });
      });

    // Resetear el formulario si es necesario
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  // Eliminar el mensaje después de 10 segundos
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: "", text: "" });
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <>
      <NavbarSupport />
      <div className="isolate bg-white dark:bg-black px-6 py-24 sm:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-100 sm:text-4xl">
            {t("donar.title", "Contact Us")}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-slate-300">
            {t(
              "donar.description",
              "We appreciate your interest in supporting our cause. Please reach out to us, and we will be happy to discuss how you can help."
            )}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("donar.firstName")}
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("donar.lastName")}
              </label>
              <div className="mt-2.5">
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("donar.email", "Email")}
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("donar.message")}
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("donar.contactUs")}
            </button>
          </div>
          {statusMessage.text && (
            <div
              className={`mt-4 p-4 rounded-md text-white ${
                statusMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {statusMessage.text}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Donar;
