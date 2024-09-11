import { useState } from "react";
import NavbarSupport from "@/components/_partials/NavbarSupport";
import emailjs from 'emailjs-com';
import { useTranslation } from "react-i18next";

function ContactUs() {
  const [t] = useTranslation("global");
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
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
    if (!formData.firstName || !formData.lastName || !formData.company || !formData.email || !formData.message || !agreed) {
      setStatusMessage({
        type: "error",
        text: t("contact.error"),
      });
      return;
    }

    // Configuración de EmailJS
    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      company: formData.company,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs.send('service_xw9e5bp', 'template_company_contact', templateParams, 'TlqBmjkxT9eSiEEGq')
      .then((response) => {
        setStatusMessage({
          type: "success",
          text: t("contact.success"),
        });
      })
      .catch((error) => {
        setStatusMessage({
          type: "error",
          text: t("contact.error"),
        });
      });

    // Resetear el formulario
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      message: "",
    });
    setAgreed(false);
  };

  return (
    <>
      <NavbarSupport />
      <div className="isolate bg-white dark:bg-black px-6 py-24 sm:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0  -z-10 transform-gpu overflow-hidden blur-3xl "
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
            {t("contact.title", "Contact Sales")}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-slate-300">
            {t("contact.description", "We are eager to collaborate with businesses. Please provide your details to initiate a discussion.")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("contact.firstName", "First Name")}
              </label>
              <div className="mt-2.5">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("contact.lastName", "Last Name")}
              </label>
              <div className="mt-2.5">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
              >
                {t("contact.company", "Company")}
              </label>
              <div className="mt-2.5">
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
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
                {t("contact.email", "Email")}
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
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
                {t("contact.message", "Message")}
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("contact.submit", "Submit")}
            </button>
          </div>
          {statusMessage.text && (
            <div className={`mt-4 p-2 text-sm ${statusMessage.type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}>
              {statusMessage.text}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default ContactUs;
