import { Image } from "@nextui-org/image";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/authContext";

function SignIn() {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const { signin, signInWithGoogle, resetPassword } = useAuth(); // Cambié SigninWithGoogle a signInWithGoogle
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `${t("navbar.signUp")} | GuateCare`;
  }, [t]);

  const currentLang = location.pathname.split("/")[1];

  //Login
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Iniciar sesión con correo y contraseña
      await signin(user.email, user.password);
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

  const handleResetPassword = async () => {
    if (!user.email) return setError("Please enter your email");
    try {
      await resetPassword(user.email);
      setError("We sent you an email with the link to reset your password");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">{t("signIn.pageTitle")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("signIn.description")}
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("signIn.emailLabel")}</Label>
                  <Input
                    onChange={handleChange}
                    id="email"
                    type="email"
                    placeholder={t("signIn.emailPlaceholder")}
                    
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {t("signIn.passwordLabel")}
                    </Label>
                    <Link
                      onClick={handleResetPassword}
                      className="ml-auto inline-block text-sm underline"
                    >
                      {t("signIn.forgotPasswordLink")}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={handleChange}
                    
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("signIn.submitButton")}
                </Button>
                <Button
                  onClick={handleGoogleSignin}
                  variant="outline"
                  className="w-full"
                >
                  {t("signIn.googleButton")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("signIn.noAccountText")}{" "}
                <Link to={`/${currentLang}/Registrese`} className="underline">
                  {t("signIn.registerLink")}
                </Link>
              </div>
            </div>
          </div>
        </form>
        <div className="hidden h-full w-full flex-col bg-muted lg:flex">
          <Image
            alt="GuateCare"
            className="mx-auto w-full object-cover"
            src="/public/img/mano.gif"
          />
        </div>
      </div>
    </>
  );
}

export default SignIn;
