import React, { useState } from "react";
import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect } from "react";
function ProblemSupport() {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation("global");

  useEffect(() => {
    document.title = `${t("problems.titleP")} | GuateCare`;
  }, [t]);
  

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: t("problems.problem1"),
      answer:
      t("problems.desprom1"),
    },
    {
      question: t("problems.problem2"),
      answer:
        t("problems.desprom2"),
      answer2:
        t("problems.angryip"),
    },
    {
      question: t("problems.problem3"),
      answer:
        t("problems.desprom3"),
      contact:
        t("problems.contact"),
    },
    {
      question: t("problems.problem4"),
      answer:
        t("problems.desprom4"),
        contact:
        t("problems.contact"),

    },
    {
      question: t("problems.problem5"),
      answer:
        t("problems.desprom5"),
 
    },
    {
      question: t("problems.problem6"),
      answer:
        t("problems.desprom6"),
        
    },
    {
      question: t("problems.problem7"),
      answer:
        t("problems.desprom7"),
        
    },
    {
      question: t("problems.problem8"),
      answer:
        t("problems.desprom8"),
      contact:
        t("problems.contact"),
    },
    // Agrega más preguntas y respuestas aquí
  ];

  return (
    <>
      <NavbarSupport />
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("problems.title")}
            </h2>
            <p className="mt-2 text-lg leading-8 ">
              {t("problems.description")}
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b  pb-6">
                  <button
                    onClick={() => toggleAnswer(index)}
                    className="w-full flex items-center justify-between text-xl font-semibold focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="text-lg">
                      {openIndex === index ? "-" : "+"}
                    </span>
                  </button>
                  {openIndex === index && <p className="mt-2 ">{faq.answer} <a href="https://www.angryip.org/" className="underline">{faq.answer2}</a> <Link to={`/Soporte/Contacto`} className="underline">{faq.contact}</Link></p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemSupport;
