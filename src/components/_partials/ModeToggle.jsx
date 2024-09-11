import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../ThemeProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [t] = useTranslation("global");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Esto asegura que el componente solo se renderice en el cliente
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        } transition-transform duration-300`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] ${
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        } transition-transform duration-300`}
      />
      <span className="sr-only">{t("modetoggle.toggle")}</span>
    </Button>
  );
}
