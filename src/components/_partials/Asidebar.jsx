import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { TriangleAlert } from "lucide-react";
import { Radar } from "lucide-react";
import { ClipboardPlus } from "lucide-react";
import { LifeBuoy } from "lucide-react";
import IconDark from "/public/icons/IconDark";
import IconLight from "/public/icons/IconLight";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase"; // Configuración de Firebase
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CircleUser, Menu, Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/authContext";

import { useTranslation } from "react-i18next";

import { Database } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { BellRing } from "lucide-react";

function Asidebar() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false); // Estado para el icono de notificación
  const [t] = useTranslation("global");
  const Icon = theme === "dark" ? IconDark : IconLight;
  const { signout, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerta"), (snapshot) => {
      const notificationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isRead: doc.data().isRead || false,
        hidden: doc.data().hidden || false, // Verificamos si la alerta está oculta
      }));
  
      setNotifications(notificationsList);
  
      // Actualiza el estado de hasNewNotifications basado en las alertas visibles
      setHasNewNotifications(
        notificationsList.some((notification) => !notification.isRead && !notification.hidden)
      );
    });
  
    return () => unsubscribe();
  }, []);
  

  // Marcar como leída y ocultar la notificación
  // Marcar como leída y ocultar la alerta temporalmente de la bandeja
const handleMarkAsRead = async (id) => {
  try {
    const notificationRef = doc(db, "alerta", id);
    await updateDoc(notificationRef, { 
      isRead: true, 
      hidden: true // Ocultamos la notificación después de marcarla como leída
    });

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id 
          ? { ...notification, isRead: true, hidden: true }
          : notification
      )
    );

    // Rehabilitar la notificación después de 5 minutos
    setTimeout(async () => {
      await updateDoc(notificationRef, { hidden: false }); // Rehabilitarla
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id 
            ? { ...notification, hidden: false }
            : notification
        )
      );
    }, 5 * 60 * 1000); // 5 minutos
  } catch (error) {
    console.error("Error al marcar como leído:", error);
  }
};



  const handleOpenNotifications = () => {
    setHasNewNotifications(false);
  };

  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h1></h1>;

  return (
    <>
      <div className="hidden md:block">
        {/* Aside bar */}
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col">
          <div className="p-2">
            <Link to={"/"}>
              <Button variant="gosht" size="icon" aria-label="Home">
                <Icon className="size-5 fill-foreground" />
              </Button>
            </Link>
          </div>
          <nav className="grid gap-1 p-2">
            <TooltipProvider>
              <Link to={"/"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg bg-muted"
                    >
                      <Radar className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("dashboard.navbar.monitoreo")}
                  </TooltipContent>
                </Tooltip>
              </Link>
              <Link to={"/Panel/Registro"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <BookMarked className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("dashboard.navbar.register")}
                  </TooltipContent>
                </Tooltip>
              </Link>
              <Link to={"/Panel/Datos"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <Database className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("dashboard.navbar.datos")}
                  </TooltipContent>
                </Tooltip>
              </Link>
              <Link to={"/Panel/Alertas"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <TriangleAlert className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("dashboard.navbar.alertas")}
                  </TooltipContent>
                </Tooltip>
              </Link>
              <Link to={"/Panel/Informes"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <ClipboardPlus className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("dashboard.navbar.informes")}
                  </TooltipContent>
                </Tooltip>
              </Link>
            </TooltipProvider>
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <TooltipProvider>
              <Link to={"/Soporte"}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-auto rounded-lg"
                    >
                      <LifeBuoy className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {t("navbar.support")}
                  </TooltipContent>
                </Tooltip>
              </Link>
            </TooltipProvider>
          </nav>
        </aside>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4  px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to={"/"}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Icon className="size-5 fill-foreground" />
                </Link>
                <Link
                  to={"/"}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 font-semibold text-foreground hover:bg-muted/70"
                >
                  {t("navbar.monitoreo")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {hasNewNotifications ? (
                  <BellRing className="h-5 w-5 text-red-500" />
                ) : (
                  <Bell className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onOpenChange={handleOpenNotifications}
              className="max-w-xs"
            >
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <DropdownMenuItem disabled>No hay notificaciones</DropdownMenuItem>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start gap-2"
                      
                    >
                      <Link to={`/Panel/Alertas`} className="w-full">
                        <Alert className="flex items-center gap-2 dark:bg-neutral-950 bg-neutral-50 " style={{ color: "red", borderColor:"red" }}>
                          <TriangleAlert className="h-4 w-4" style={{ color: "red" }} />
                          <AlertTitle>Alerta</AlertTitle>
                          <AlertDescription>
                            Haz clic para ver los detalles.
                          </AlertDescription>
                        </Alert>
                      </Link>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        {notification.isRead ? "Leída" : "Marcar como leído"}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <Link to="/Panel/Alertas">
                <DropdownMenuItem>Ver todas las alertas</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t("dashboard.navbar.account")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={"/Panel/Ajustes "}>
                <DropdownMenuItem>
                  {t("dashboard.navbar.settings")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSignout()}>
                {t("dashboard.navbar.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </header>
      </div>
    </>
  );
}

export default Asidebar;
