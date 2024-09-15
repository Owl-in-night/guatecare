
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/authContext";

function SignIn() {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const { signin, signInWithGoogle, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = `${t("navbar.signInA")} | GuateCare`;
  }, [t]);



  // Limpiar mensajes de error y éxito al cambiar de idioma
  useEffect(() => {
    setError("");
    setGoogleError("");
    setSuccessMessage("");
  }, [i18n.language]);

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
    setError("");
    setSuccessMessage("");
    setGoogleError(""); // Limpiar también el error de Google al cambiar datos
  };

  const validateInputs = () => {
    if (!user.email || !user.password) {
      return t("signIn.errors.none");
    }
    if (!user.email.includes("@")) {
      return t("signIn.errors.missingAt");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      return t("signIn.errors.invalidEmail");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setGoogleError(""); // Limpiar errores de Google también

    const validationError = validateInputs();
    if (validationError) {
      return setError(validationError);
    }

    try {
      await signin(user.email, user.password);
      navigate(`/Panel`, { replace: true });
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
          setError(t("signIn.errors.invalidCredential"));
          break;
        case "auth/user-not-found":
          setError(t("signIn.errors.userNotFound"));
          break;
        case "auth/invalid-password":
          setError(t("signIn.errors.invalidPassword"));
          break;
        case "auth/too-many-requests":
          setError(t("signIn.errors.tooManyRequests"));
          break;
        default:
          setError(t("signIn.errors.default"));
          break;
      }
    }
  };

  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    setGoogleError("");
    setSuccessMessage("");
    setError(""); // Limpiar cualquier otro error

    try {
      await signInWithGoogle();
      navigate(`/Panel`, { replace: true });
    } catch (error) {
      setGoogleError(t("signIn.errors.googleSigninError"));
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setGoogleError("");
    setSuccessMessage(""); // Limpiar mensajes anteriores

    if (!user.email) {
      return setError(t("signIn.errors.emailRequired"));
    }

    try {
      await resetPassword(user.email);
      setSuccessMessage(t("signIn.errors.resetPasswordSuccess"));
    } catch (error) {
      setError(t("signIn.errors.resetPasswordError"));
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">{t("signIn.pageTitle")}</h1>
              <p className="text-balance text-muted-foreground">
                {t("signIn.description")}
              </p>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}

            {/* Formulario de inicio de sesión */}
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("signIn.emailLabel")}</Label>
                  <Input
                    onChange={handleChange}
                    id="email"
                    type="email"
                    name="email"
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
                    name="password"
                    placeholder={t("signIn.passwordPlaceholder")}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("signIn.submitButton")}
                </Button>
              </div>
            </form>

            {/* Inicio de sesión con Google */}
            <form onSubmit={handleGoogleSignin}>
              {googleError && (
                <p className="text-red-500 text-center">{googleError}</p>
              )}
              <Button type="submit" variant="outline" className="w-full">
                {t("signIn.googleButton")}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              {t("signIn.noAccountText")}{" "}
              <Link to={`/Registrese`} className="underline">
                {t("signIn.registerLink")}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden h-full w-full flex-col bg-muted lg:flex">
          <img
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
