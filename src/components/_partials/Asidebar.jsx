import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
//Mobile

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
import {
  CircleUser,
  Menu,
} from "lucide-react";
// import { Link } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";

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

function Asidebar() {
  const { theme } = useTheme();

  const [t] = useTranslation("global");

  const Icon = theme === "dark" ? IconDark : IconLight;

  const { signout, loading } = useAuth();
  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h1>Loading</h1>;
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
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 bg-muted text-muted-foreground hover:text-foreground"
                >
                  
                  <Radar className="h-5 w-5" />
                  {t("dashboard.navbar.monitoreo")}
                  
                </Link>
                <Link
                  to={"/Panel/Registro"}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <BookMarked className="h-5 w-5" />
                  {t("dashboard.navbar.register")}
                  {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge> */}
                </Link>
                <Link
                  to={"/Panel/Alertas"}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <TriangleAlert className="h-5 w-5" />
                  {t("dashboard.navbar.alertas")}
                </Link>
                <Link
                  to={"/Panel/Informes"}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <ClipboardPlus className="h-5 w-5" />
                  {t("dashboard.navbar.informes")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
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
              <Link to={"/Panel/Ajustes "} >
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
