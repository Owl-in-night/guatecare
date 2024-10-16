import { useState, useEffect } from "react";
import NavbarSupport from "@/components/_partials/NavbarSupport";
import { Radio, RadioGroup } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export default function UserManual() {
  const { t } = useTranslation("global");

  useEffect(() => {
    document.title = `${t("support.navbar.manual")} | GuateCare`;
  }, [t]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    href: "#",
    breadcrumbs: [],
    images: [], // Inicialmente vacío
    colors: [],
    steps: [],
    description: "",
    highlights: [],
    details: "",
  });

  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    const updatedProduct = {
      name: t("manual.title"),
      price: "$192",
      href: "#",
      breadcrumbs: [
        { id: 1, name: "Men", href: "#" },
        { id: 2, name: "Clothing", href: "#" },
      ],
      images: [
        {
          src: "/img/b.jpg",
          alt: "Two each of gray, white, and black shirts laying flat.",
        },
        {
          src: "/img/d.jpg",
          alt: "Model wearing plain black basic tee.",
        },
        {
          src: "/img/a.jpg",
          alt: "Model wearing plain gray basic tee.",
        },
        {
          src: "/img/c1.jpg",
          alt: "Model wearing plain white basic tee.",
        },
      ],
      colors: [
        { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
        { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
        { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
      ],
      steps: [
        {
          name: "1",
          inStock: true,
          content: t("manual.step1"),
          content2: t("manual.step1dec"),
          image: "/img/on.jpg",
        },
        {
          name: "2",
          inStock: true,
          content: t("manual.step2"),
          content2: t("manual.step2desc"),
          image: "/img/fuente.png",
        },
        {
          name: "3",
          inStock: true,
          content: t("manual.step3"),
          content2: t("manual.step3desc"),
          image: "/img/connection.png",
        },
        {
          name: "4",
          inStock: true,
          content: t("manual.step4"),
          content2: t("manual.step4desc"),
          image: "/img/login.png",
        },
        {
          name: "5",
          inStock: true,
          content: t("manual.step5"),
          content2: t("manual.step5desc"),
          image: "/img/dashboard.png",
        },
        {
          name: "6",
          inStock: true,
          content: t("manual.step6"),
          content2: t("manual.step6desc"),
          content3: [
            t("manual.highlights"),
            t("manual.highlights2"),
            t("manual.highlights3"),
            t("manual.highlights5"),
            t("manual.highlights6"),
          ],
          image: "/img/navigation.png",
        },
        {
          name: "7",
          inStock: true,
          content: t("manual.step7"),
          content2: t("manual.step7desc"),
          image: "/img/monitoreo.png",
        },
        {
          name: "8",
          inStock: true,
          content: t("manual.step8"),
          content2: t("manual.step8desc"),
          image: "https://example.com/step1-image.jpg",
        },
        {
          name: "9",
          inStock: true,
          content: t("manual.step9"),
          content2: t("manual.step9desc"),
          image: "https://example.com/step1-image.jpg",
        },
        {
          name: "10",
          inStock: true,
          content: t("manual.step10"),
          content2: t("manual.step10desc"),
          image: "/img/ajustes.png",
          content4: t("manual.support"),
          content5: t("manual.supportdesc"),
        },
      ],
      description: t("manual.description"),
      details:
        'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
    };

    setProduct(updatedProduct);
    setSelectedStep(updatedProduct.steps[0]); // Inicializar con el primer paso
  }, [t]);

  return (
    <>
      <NavbarSupport />
      <div className="">
        <div className="pt-6">
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            {product.images.length > 0 && (
              <>
                <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                  <img
                    alt={product.images[0].alt}
                    src={product.images[0].src}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                  {product.images[1] && (
                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                      <img
                        alt={product.images[1].alt}
                        src={product.images[1].src}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                  {product.images[2] && (
                    <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                      <img
                        alt={product.images[2].alt}
                        src={product.images[2].src}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                </div>
                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                  {product.images[3] && (
                    <img
                      alt={product.images[3].alt}
                      src={product.images[3].src}
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-3xl">
                {product.name}
              </h1>
              <div>
                <div className="py-10 lg:col-span-2 lg:col-start-1  lg:pt-6">
                  <p className="text-base text-gray-900 dark:text-gray-200">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <form className="mt-10">
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t("manual.step")}
                    </h3>
                  </div>
                  <fieldset aria-label="Choose a step" className="mt-4">
                    <RadioGroup
                      value={selectedStep}
                      onChange={setSelectedStep}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    >
                      {product.steps.map((step) => (
                        <Radio
                          key={step.name}
                          value={step}
                          disabled={!step.inStock}
                          className={({ checked }) =>
                            `${
                              step.inStock
                                ? "cursor-pointer bg-white text-gray-900 dark:bg-black dark:text-gray-100 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-200"
                            }
                            group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 dark:hover:bg-neutral-800 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1 sm:py-6`
                          }
                        >
                          <span>{step.name}</span>
                          {step.inStock ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                stroke="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                              >
                                <line
                                  x1={0}
                                  x2={100}
                                  y1={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pr-8">
              {selectedStep && (
                <>
                  <h3 className="sr-only">Content</h3>
                  <div className="space-y-6">
                    <p className="text-2xl text-gray-900 dark:text-gray-200">
                      {selectedStep.content}
                    </p>
                    <p className="text-md text-gray-900 dark:text-gray-300">
                      {selectedStep.content2}
                    </p>
                  </div>
                  {selectedStep.content3 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t("manual.found")}
                      </h4>
                      <ul className="list-disc ml-5 space-y-2 text-gray-900 dark:text-gray-200">
                        {selectedStep.content3.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
                    {selectedStep?.image && (
                      <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
                        <img
                          // alt={`Image for step ${selectedStep.name}`}
                          src={selectedStep.image}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                  </div>
                  <div className="py-10 lg:col-span-2 lg:col-start-1  lg:pr-8">
                    <p className="text-base text-gray-900 dark:text-gray-200">
                      {selectedStep.content4}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-300">
                      {selectedStep.content5}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
