import { Image } from "@nextui-org/image";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/authContext";

function SignUp() {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const { signup, signInWithGoogle } = useAuth(); // Cambié SigninWithGoogle a signInWithGoogle
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `${t("navbar.signUp")} | GuateCare`;
  }, [t]);

  const currentLang = location.pathname.split("/")[1];

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user.email || !user.password) {
      return setError("Email and password are required");
    }

    try {
      await signup(user.email, user.password);
      navigate(`/${currentLang}/Panel`, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await signInWithGoogle(); // Cambié SigninWithGoogle a signInWithGoogle
      navigate(`/${currentLang}/Panel`, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden h-full w-full flex-col bg-muted lg:flex">
          <Image
            alt="GuateCare"
            className="mx-auto w-full object-cover"
            src="/public/img/love.gif"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">{t("signUp.pageTitle")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("signUp.description")}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("signUp.emailLabel")}</Label>
                  <Input
                    onChange={handleChange}
                    id="email"
                    type="email"
                    placeholder={t("signUp.emailPlaceholder")}
                    
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {t("signUp.passwordLabel")}
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={handleChange}
                    
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("signUp.pageTitle")}
                </Button>
                <Button
                  onClick={handleGoogleSignin}
                  variant="outline"
                  className="w-full"
                >
                  {t("signUp.googleButton")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("signUp.alreadyHaveAccountText")}{" "}
                <Link to={`/${currentLang}/Acceder`} className="underline">
                  {t("signUp.signInLink")}
                </Link>
              </div>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default SignUp;
