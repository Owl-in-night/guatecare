import { useEffect } from "react";

// import { buttonVariants } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  BookType,
  FileSliders,
  ServerCrash,
  Mailbox,
  Handshake,
  CircleHelp,
  Album,
  BookImage,
  MapPinned,
  HandCoins,
} from "lucide-react";

//Navbar
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { ModeToggle } from "../components/_partials/ModeToggle";
// import { CircleHelp, BookUser, LogIn, Settings } from "lucide-react";
//i18n
//Language
import { useTranslation } from "react-i18next";
import i18next from "i18next";

//icon
// import IconM from "../../public/icons/iconGuateCare";
// import IconName from "../../public/icons/iconName";
// import IconSupport from "../../public/icons/iconSoporte";
//End navbar

import // ChevronLeft,
// ChevronRight,
// Copy,
// CreditCard,
// File,
// Home,
// ListFilter,
// MoreVertical,
// Package,
// Package2,
// PanelLeft,
// Search,
// // Settings,
// ShoppingCart,
// Truck,
// Users2,
"lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//CSS
import "../css/styles.css";

//Navbar Support
import NavbarSupport from "@/components/_partials/NavbarSupport";

export default function Support() {
  //Time

  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { t } = useTranslation("global");
  // const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual
  // const navigate = useNavigate(); // Obtener la función navigate

  useEffect(() => {
    document.title = `${t("navbar.support")} | GuateCare`;
  }, [t]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      i18next.changeLanguage(savedLanguage);
    }
  }, []);

  // const changeLanguage = (lang) => {
  //   i18next.changeLanguage(lang);
  //   localStorage.setItem("userLanguage", lang);
  //   navigate(`/${lang}${location.pathname.replace(`/${currentLang}`, "")}`, {
  //     replace: true,
  //   });
  // };

  // const handleOpenModal = () => {
  //   setIsSheetOpen(false); // Cierra el Sheet primero
  //   onOpen(); // Abre el Modal después de cerrar el Sheet
  // };

  // Obtener el idioma actual desde la URL

  return (
    <>
      {/* Navbar */}
      <NavbarSupport />
      {/* End Navbar */}
      {/* Contenido */}
      <div className="grid gap-4 mb-5 md:items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
        <div className="banner-bg h-60 w-full flex items-center justify-center">
          <div className="text-white text-center z-10">
            <h1 className="text-2xl font-bold">{t("support.page.welcome")}</h1>
            <p className="mt-2 text-lg">{t("support.page.description")}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Sección de Tarjetas - Primer Grupo */}
        <main className="flex flex-col items-center gap-4 p-4 sm:px-6 sm:py-0 mt-10">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              to={`/Soporte/Manual`}
              className="block w-full h-auto md:w-[450px] md:h-auto lg:w-[315px] lg:h-auto xl:w-[400px] xl:h-auto 2xl:w-[450px] 2xl:h-auto"
            >
              <Card
                className="h-full flex flex-col"
                x-chunk="dashboard-05-chunk-1"
              >
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center justify-center h-full w-full">
                    <BookType className="h-36 w-36" />
                  </div>
                  <CardTitle className="text-4xl text-center">
                    {t("support.page.title1")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow hidden md:block lg:block xl:block 2xl:block ">
                  <div className="text-md text-muted-foreground">
                    {t("support.page.description1")}
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </Link>
            <Link
              to={`/Soporte/Crear-Editar`}
              className="block w-full h-auto md:w-[450px] md:h-auto lg:w-[315px] lg:h-auto xl:w-[400px] xl:h-auto 2xl:w-[450px] 2xl:h-auto"
            >
              <Card
                className="h-full flex flex-col"
                x-chunk="dashboard-05-chunk-1"
              >
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center justify-center h-full w-full">
                    <FileSliders className="h-36 w-36" />
                  </div>
                  <CardTitle className="text-4xl text-center">
                    {t("support.page.title2")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow hidden md:block lg:block xl:block 2xl:block ">
                  <div className="text-md text-muted-foreground">
                    {t("support.page.description2")}
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </Link>
            <Link
              to={`/Soporte/Problemas`}
              className="block w-full h-auto md:w-[450px] md:h-auto lg:w-[315px] lg:h-auto xl:w-[400px] xl:h-auto 2xl:w-[450px] 2xl:h-auto"
            >
              <Card
                className="h-full flex flex-col"
                x-chunk="dashboard-05-chunk-1"
              >
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center justify-center h-full w-full">
                    <ServerCrash className="h-36 w-36" />
                  </div>
                  <CardTitle className="text-4xl text-center">
                    {t("support.page.title3")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow hidden md:block lg:block xl:block 2xl:block ">
                  <div className="text-md text-muted-foreground">
                    {t("support.page.description3")}
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </Link>
          </div>
        </main>

        {/* Sección de Tarjetas - Segundo Grupo */}
        <main className="flex flex-col items-center gap-4 p-4 sm:px-6 sm:py-0 md:mt-28 lg:mt-28 xl:mt-28 2xl:mt-24">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              to={`/Soporte/Contacto`}
              className="block w-full h-auto md:w-[450px] md:h-auto lg:w-[315px] lg:h-auto xl:w-[400px] xl:h-auto 2xl:w-[450px] 2xl:h-auto"
            >
              <Card
                className="h-full flex flex-col"
                x-chunk="dashboard-05-chunk-1"
              >
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center justify-center h-full w-full">
                    <Mailbox className="h-36 w-36" />
                  </div>
                  <CardTitle className="text-4xl text-center">
                    {t("support.page.title4")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow hidden md:block lg:block xl:block 2xl:block ">
                  <div className="text-md text-muted-foreground">
                    {t("support.page.description4")}
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </Link>
            <Link
              to={`/Soporte/Comunidad`}
              className="block w-full h-auto md:w-[450px] md:h-auto lg:w-[315px] lg:h-auto xl:w-[400px] xl:h-auto 2xl:w-[450px] 2xl:h-auto"
            >
              <Card
                className="h-full flex flex-col"
                x-chunk="dashboard-05-chunk-1"
              >
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex items-center justify-center h-full w-full">
                    <Handshake className="h-36 w-36" />
                  </div>
                  <CardTitle className="text-4xl text-center">
                    {t("support.page.title5")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow hidden md:block lg:block xl:block 2xl:block ">
                  <div className="text-md text-muted-foreground">
                    {t("support.page.description5")}
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </Link>
          </div>
        </main>
      </div>

      <div className="p-6">
        {/* Sección de Soporte Técnico */}
        <main className="flex flex-col items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {/* Tarjeta 1 */}

            <Card
              className=" max-w-xs h-[350px]"
              x-chunk="dashboard-05-chunk-1"
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-lg flex">
                  <CircleHelp className="mr-2 h-6 w-6" />
                  {t("support.page.title6")}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {t("support.page.subtitle6")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("support.page.description6")}{" "}
                  <Link
                    className="font-bold text-zinc-800 dark:text-zinc-200"
                    to={`/Soporte/Sobre-Nosotros`}
                  >
                    {t("support.others.readmore")}
                  </Link>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            {/* Tarjeta 2 */}
            <Card className=" max-w-md h-auto" x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg flex">
                  <Album className="mr-2 h-6 w-6" />
                  {t("support.page.title7")}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {t("support.page.subtitle7")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("support.page.description7")}{" "}
                  <Link
                    className="font-bold text-zinc-800 dark:text-zinc-200"
                    to={`/Soporte/Historia`}
                  >
                    {t("support.others.readmore")}
                  </Link>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            {/* Tarjeta 3 */}
            <Card
              className="w-full max-w-md h-auto"
              x-chunk="dashboard-05-chunk-1"
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-lg flex">
                  {" "}
                  <BookImage className="mr-2 h-6 w-6" />{" "}
                  {t("support.page.title8")}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {t("support.page.subtitle8")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("support.page.description8")}{" "}
                  <Link
                    className="font-bold text-zinc-800 dark:text-zinc-200"
                    to={`/Soporte/Fotos`}
                  >
                    {t("support.others.seemore")}
                  </Link>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            {/* Tarjeta 4 */}
            <Card className=" max-w-md h-auto" x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg flex">
                  {" "}
                  <MapPinned className="mr-2 h-6 w-6" />
                  {t("support.page.title9")}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {t("support.page.subtitle9")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("support.page.description9")}{" "}
                  <Link
                    className="font-bold text-zinc-800 dark:text-zinc-200"
                    to={`/Soporte/Mapa`}
                  >
                    {t("support.others.map")}
                  </Link>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            {/* Tarjeta 5 */}
            <Card className=" max-w-md h-auto" x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription className="text-lg flex">
                  {" "}
                  <HandCoins className="mr-2 h-6 w-6" />
                  {t("support.page.title10")}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {t("support.page.subtitle10")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-md text-muted-foreground">
                  {t("support.page.description10")}{" "}
                  <Link
                    className="font-bold text-zinc-800 dark:text-zinc-200"
                    to={`/Soporte/Donar`}
                  >
                    {t("support.others.donate")}
                  </Link>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
