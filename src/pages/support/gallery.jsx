import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";

function GalleryA() {
  const [t] = useTranslation("global");

  useEffect(() => {
    document.title = `${t("support.page.title8")} | GuateCare`;
  }, [t]);
  // Estado para manejar el modal y la imagen seleccionada
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const features = [
    { name: t("gallery.autor"), description: "Santos Pedro Baltazar Joj Cano" },
    { name: t("gallery.materiales"), description: t("gallery.description2") },
    { name: t("gallery.dimensions"), description: t("gallery.description3") },
    { description: t("gallery.subdescription3") },
    { name: t("gallery.finish"), description: t("gallery.description4") },
    { name: t("gallery.includes"), description: t("gallery.description5") },
    {
      name: t("gallery.considerations"),
      description: t("gallery.description6"),
    },
  ];

  // Lista de imágenes con diferentes alturas
  const images = [
    { src: "/img/1.png", height: "h-64" },
    { src: "/img/2.png", height: "h-80" },
    { src: "/img/3.png", height: "h-96" },
    { src: "/img/4.png", height: "h-72" },
    { src: "/img/5.png", height: "h-80" },
    { src: "/img/a.jpg", height: "h-64" },
    { src: "/img/b.jpg", height: "h-72" },
    { src: "/img/c.jpg", height: "h-90" },
    { src: "/img/d.jpg", height: "h-96" },
  ];

  // Función para abrir el modal con la imagen seleccionada
  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <NavbarSupport />
      {/* Descripción */}
      <div className=" min-h-screen">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 lg:px-8">
          <div className=" min-h-screen">
            <div className="mx-auto max-w-7xl py-24 px-8 sm:px-6 lg:px-8">
              {/* Información de la obra */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight ">
                    {t("gallery.build")}
                  </h2>
                  <p className="mt-4 text-lg ">
                    {t("gallery.description")}
                  </p>
                  <dl className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    {features.map((feature) => (
                      <div
                        key={feature.name}
                        className="border-t border-gray-500 pt-4"
                      >
                        <dt className="font-medium ">
                          {feature.name}
                        </dt>
                        <dd className="mt-2 text-sm ">
                          {feature.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex items-center justify-center rounded-2xl">
                  <img
                    src="/img/SH.png"
                    className="w-96 h-96 md:w-full md:h-full lg:w-full lg:h-full xl:w-full xl:h-full 2xl:w-full 2xl:h-full object-cover transform transition-transform duration-500 group-hover:scale-105 py-5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Galería estilo Pinterest */}
          <div className="mt-16 px-8">
            <h3 className="text-3xl font-bold text-white mb-8">
              {t("gallery.galeria")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer ${image.height} overflow-hidden rounded-lg shadow-md`}
                  onClick={() => openModal(image.src)} // Al hacer clic, abre el modal con la imagen
                >
                  <img
                    src={image.src}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-lg font-bold">
                      {t("gallery.watch")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para ver imagen completa */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal} // Cerrar modal al hacer clic fuera de la imagen
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevenir el cierre al hacer clic en la imagen
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-h-screen max-w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryA;
