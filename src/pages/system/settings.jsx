// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/authContext";
import { Earth } from "lucide-react";
import { useEffect } from "react";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/_partials/ModeToggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
export function SettingsA() {
  const [t] = useTranslation("global");
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("userLanguage");
    if (savedLanguage) {
      i18next.changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    i18next.changeLanguage(lang).then(() => {
      localStorage.setItem("userLanguage", lang);
      const path = location.pathname.replace(/^\/[a-z]{2}/, `/${lang}`);
      navigate(path, { replace: true });
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-center mb-4 mx-14">
        <div className="flex min-h-screen w-full flex-col">
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
              <h1 className="text-3xl font-semibold">{t("navbar.settings")}</h1>
            </div>

            {/* Contenedor para la imagen de perfil y las tarjetas */}
            <div className="flex flex-col md:flex-row justify-center items-start mx-auto w-full max-w-6xl mt-2 gap-4">
              {/* Tarjeta de perfil */}
              <div className="flex justify-center items-center max-w-2xl md:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("dashboard.settings.welcome")}{" "}
                      {user?.displayName || user?.email}
                    </CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/XJzW49P/img13.png"
                      }
                      alt=""
                      className="h-16 w-16 rounded-full border"
                      onError={(e) => {
                        e.target.src = "https://i.ibb.co/XJzW49P/img13.png"; // Cambia a la imagen de respaldo si hay un error
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Tarjetas de configuración */}
              <div className="grid gap-4 md:w-2/3 w-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.settings.theme")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.settings.theme2")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ModeToggle />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.settings.language")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.settings.language2")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NavigationMenu className="z-50 hidden md:block">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>
                            <Earth className="h-6 w-6" />
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            {/* Opciones de idiomas */}
                            {["en", "es", "fr", "hi", "ch"].map((lang) => (
                              <NavigationMenuLink
                                key={lang}
                                onClick={() => changeLanguage(lang)}
                                className="group inline-flex h-10 w-28 items-center justify-center rounded-md py-2 font-medium hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-gray-800"
                              >
                                <Avatar className="w-8 h-8 flex items-center justify-center rounded-full border shadow-lg">
                                  <AvatarImage
                                    src={`https://flagcdn.com/${
                                      lang === "en"
                                        ? "us"
                                        : lang === "es"
                                        ? "gt"
                                        : lang === "fr"
                                        ? "fr"
                                        : lang === "hi"
                                        ? "in"
                                        : "cn"
                                    }.svg`}
                                    alt={`Flag of ${lang}`}
                                    className="w-full h-full object-cover"
                                  />
                                </Avatar>
                                <span className="ml-2">
                                  {" "}
                                  {/* Añade un margen a la izquierda */}
                                  {lang === "en"
                                    ? t("navbar.english")
                                    : lang === "es"
                                    ? t("navbar.spanish")
                                    : lang === "fr"
                                    ? t("navbar.french")
                                    : lang === "hi"
                                    ? t("navbar.hindi")
                                    : t("navbar.chinese")}
                                </span>
                              </NavigationMenuLink>
                            ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex-1 ml-auto  md:hidden">
                      <Select onValueChange={(lang) => changeLanguage(lang)}>
                        <SelectTrigger className="w-full flex justify-center">
                          <Earth className="h-6 w-6" />
                        </SelectTrigger>
                        <SelectContent className="w-8">
                          <SelectGroup>
                            {["en", "es", "fr", "hi", "ch"].map((lang) => (
                              <SelectItem
                                key={lang}
                                value={lang}
                                className="w-full"
                              >
                                <Avatar className="w-8 h-8 rounded-full border shadow-md">
                                  <AvatarImage
                                    src={`https://flagcdn.com/${
                                      lang === "en"
                                        ? "us"
                                        : lang === "es"
                                        ? "gt"
                                        : lang === "fr"
                                        ? "fr"
                                        : lang === "hi"
                                        ? "in"
                                        : "cn"
                                    }.svg`}
                                    alt={`Flag of ${
                                      lang === "en"
                                        ? "United States"
                                        : lang === "es"
                                        ? "Guatemala"
                                        : lang === "fr"
                                        ? "France"
                                        : lang === "hi"
                                        ? "India"
                                        : "China"
                                    }`}
                                    className="rounded-full object-cover"
                                  />
                                </Avatar>
                                {lang === "en"
                                  ? t("navbar.english")
                                  : lang === "es"
                                  ? t("navbar.spanish")
                                  : lang === "fr"
                                  ? t("navbar.french")
                                  : lang === "hi"
                                  ? t("navbar.hindi")
                                  : t("navbar.chinese")}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
