import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Avatar } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//Modal
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Button, useDisclosure } from "@nextui-org/react";
import { ModeToggle } from "./ModeToggle";
import { Home, LogIn, LifeBuoy, Settings } from "lucide-react";
//i18n
//Language
import { useTranslation } from "react-i18next";
import i18next from "i18next";

//icon  
import IconM from "../../../public/icons/iconMatma";
import IconName from "../../../public/icons/iconName";
export default function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { t } = useTranslation("global");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual
  const navigate = useNavigate(); // Obtener la función navigate

  useEffect(() => {
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      i18next.changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    i18next.changeLanguage(lang);
    localStorage.setItem("userLanguage", lang);
    navigate(`/${lang}${location.pathname.replace(`/${currentLang}`, "")}`, {
      replace: true,
    });
  };

  const handleOpenModal = () => {
    setIsSheetOpen(false); // Cierra el Sheet primero
    onOpen(); // Abre el Modal después de cerrar el Sheet
  };

  // Obtener el idioma actual desde la URL

  //Visibility
  const { pathname } = useLocation();

  const currentLang = location.pathname.split("/")[1];

  if (pathname === `/${currentLang}/Soporte` || pathname === `/${currentLang}/Soporte/Sobre-Nosotros` || pathname === `/${currentLang}/Soporte/Contacto` || pathname === `/${currentLang}/Soporte/Licencia` || pathname === `/${currentLang}/Soporte/Manual` ||  pathname === `/${currentLang}/Soporte/Politicas-y-Privacidad` ||  pathname === `/${currentLang}/Soporte/Crear-Editar` ||  pathname === `/${currentLang}/Soporte/Problemas` || pathname === `/${currentLang}/Soporte/Comunidad` || pathname === `/${currentLang}/Soporte/Historia` || pathname === `/${currentLang}/Soporte/Fotos` || pathname === `/${currentLang}/Soporte/Mapa` || pathname === `/${currentLang}/Soporte/Donar` || pathname === `/${currentLang}/Panel`) return null


  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      {/* Mobile */}
      <Sheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden xl:hidden 2xl:hidden"
            onClick={() => setIsSheetOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="lg:hidden xl:hidden 2xl:hidden">
          <Link to={`/${currentLang}/`} className="mr-6 lg:flex">
            {/* <MountainIcon className="h-6 w-6" /> */}
            <IconM className="h-16 w-16" />
            <span className="sr-only">GuateCare</span>
          </Link>
          {/* Menu LINK */}
          <div className="grid gap-2 py-6">
            <Link
              to={`/${currentLang}/`}
              className="flex w-full items-center py-2 text-lg font-semibold"
            >
              <Home className="h-10 w-10 px-2" />
              {t("navbar.home")}
            </Link>
            <Link
              to={`/${currentLang}/Acceder`}
              className="flex w-full items-center py-2 text-lg font-semibold"
            >
              <LogIn className="h-10 w-10 px-2" />
              {t("navbar.signInA")}
            </Link>
            <Link
              to={`/${currentLang}/Soporte`}
              className="flex w-full items-center py-2 text-lg font-semibold"
            >
              <LifeBuoy className="h-10 w-10 px-2" />
              {t("navbar.support")}
            </Link>
            {/* End MENU LINK */}
          </div>
        </SheetContent>
        {/* Button and modal */}
        <Button
          onClick={handleOpenModal}
          variant="light"
          className="ml-auto lg:hidden xl:hidden 2xl:hidden"
          startContent={<Settings />}
        ></Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop:
              "lg:hidden xl:hidden 2xl:hidden",
          }}
        >
          <ModalContent className="lg:hidden xl:hidden 2xl:hidden overflow-visible">
            {(onClose) => (
              <>
                <ModalHeader>{t("navbar.settings")}</ModalHeader>
                <ModalBody>
                  <div className="flex items-center justify-center">
                    {/* Theme changer */}
                    <ModeToggle />
                    {/* Language changer */}
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder={t("navbar.language")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="items-center">
                          <SelectItem
                            value="en"
                            onClick={() => changeLanguage("en")}
                          >
                            <Avatar
                              alt="USA"
                              className="justify-items-start justify-start w-6 h-6" /* Avatar circular */
                              src="https://flagcdn.com/us.svg"
                            />
                            {t("navbar.english")}
                          </SelectItem>
                          <SelectItem
                            onClick={() => changeLanguage("es")}
                            value="es"
                          >
                            <Avatar
                              alt="Guatemala"
                              className="justify-items-start w-6 h-6"
                              src="https://flagcdn.com/gt.svg"
                            />
                            {t("navbar.spanish")}
                          </SelectItem>
                          <SelectItem
                            onClick={() => changeLanguage("fr")}
                            value="fr"
                          >
                            <Avatar
                              alt="Francia"
                              className="justify-items-start w-6 h-6"
                              src="https://flagcdn.com/fr.svg"
                            />
                            {t("navbar.french")}
                          </SelectItem>
                          <SelectItem
                            onClick={() => changeLanguage("hi")}
                            value="hi"
                          >
                            <Avatar
                              alt="Hindia"
                              className="justify-items-start w-6 h-6"
                              src="https://flagcdn.com/in.svg"
                            />
                            {t("navbar.hindi")}
                          </SelectItem>
                          <SelectItem
                            onClick={() => changeLanguage("ch")}
                            value="ch"
                          >
                            <Avatar
                              alt="China"
                              className="justify-items-start w-6 h-6"
                              src="https://flagcdn.com/cn.svg"
                            />
                            {t("navbar.chinese")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* End Button and modal */}
      </Sheet>
      {/* PC */}
      <Link
        to={`/${currentLang}/`}
        className="hidden md:hidden items-center md:flex lg:flex xl:flex 2xl:flex "
      >
        {/* <MountainIcon className="h-6 w-6" /> */}
        <IconM />
        <div className="ml-5">
          <IconName />
        </div>
        <span className="sr-only">GuateCare</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        <Link
          to={`/${currentLang}/`}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          {t("navbar.home")}
        </Link>
        <Link
          to={`/${currentLang}/Acceder`}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          {t("navbar.signInA")}
        </Link>

        <Link
          to={`/${currentLang}/Soporte`}
          className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
        >
          {t("navbar.support")}
        </Link>
        {/* Language */}
        <NavigationMenu className="z-50">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("navbar.language")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink
                  onClick={() => changeLanguage("en")}
                  className="group inline-flex h-9 w-28 items-center justify-center rounded-md  py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  <Avatar
                    alt="USA"
                    className="mr-2 justify-items-start w-6 h-6"
                    src="https://flagcdn.com/us.svg"
                  />
                  {t("navbar.english")}
                </NavigationMenuLink>
                <NavigationMenuLink
                  onClick={() => changeLanguage("es")}
                  className="group inline-flex h-9 w-full items-center justify-center rounded-md py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  <Avatar
                    alt="Guatemala"
                    className="mr-2 justify-items-start w-6 h-6"
                    src="https://flagcdn.com/gt.svg"
                  />
                  {t("navbar.spanish")}
                </NavigationMenuLink>
                <NavigationMenuLink
                  onClick={() => changeLanguage("fr")}
                  className="group inline-flex h-9 w-full items-center justify-center rounded-md  py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  <Avatar
                    alt="Francia"
                    className="mr-2 justify-items-start w-6 h-6"
                    src="https://flagcdn.com/fr.svg"
                  />
                  {t("navbar.french")}
                </NavigationMenuLink>
                <NavigationMenuLink
                  onClick={() => changeLanguage("hi")}
                  className="group inline-flex h-9 w-full items-center justify-center rounded-md  py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  <Avatar
                    alt="Hindia"
                    className="mr-2 justify-items-start w-6 h-6"
                    src="https://flagcdn.com/in.svg"
                  />
                  {t("navbar.hindi")}
                </NavigationMenuLink>
                <NavigationMenuLink
                  onClick={() => changeLanguage("ch")}
                  className="group inline-flex h-9 w-full items-center justify-center rounded-md  py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-zinc-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                >
                  <Avatar
                    alt="China"
                    className="mr-2 justify-items-start w-6 h-6"
                    src="https://flagcdn.com/cn.svg"
                  />
                  {t("navbar.chinese")}
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Theme changer */}
        <ModeToggle />
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

// function MountainIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   );
// }
