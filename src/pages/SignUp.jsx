import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/authContext";

function SignUp() {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    acceptedTerms: false, // Estado del checkbox
  });
  const { signup, signInWithGoogle } = useAuth();

  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    document.title = `${t("navbar.signUp")} | GuateCare`;
  }, [t]);

  useEffect(() => {
    setError("");
    setGoogleError("");
  }, [i18n.language]);

  // Actualiza el estado del usuario, maneja todos los campos
  const handleChange = ({ target: { name, value, type, checked } }) => {
    if (type === "checkbox") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: checked,
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
    setError("");

    if (name === "confirmPassword") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const validateInputs = () => {
    if (
      !user.email ||
      !user.password ||
      !user.confirmPassword ||
      !user.displayName ||
      !user.acceptedTerms // Verificar aceptación de términos
    ) {
      return t("signUp.none");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      return t("signUp.invalidEmail");
    }

    if (user.password.length < 6) {
      return t("signUp.passwordTooShort");
    }

    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!hasNumber.test(user.password)) {
      return t("signUp.passwordNoNumber");
    }
    if (!hasSpecialChar.test(user.password)) {
      return t("signUp.passwordNoSpecialChar");
    }

    if (user.password !== user.confirmPassword) {
      return t("signUp.passwordsDoNotMatch");
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGoogleError("");
  
    const validationError = validateInputs();
    if (validationError) {
      return setError(validationError);
    }
  
    try {
      await signup(
        user.email,
        user.password,
        user.displayName,
        user.acceptedTerms // Pasar acceptedTerms
      );
      navigate(`/Panel`, { replace: true });
    } catch (error) {
      // Manejo de errores
      switch (error.code) {
        case "auth/email-already-in-use":
          setError(t("signUp.emailInUse"));
          break;
        case "auth/invalid-email":
          setError(t("signUp.invalidEmail"));
          break;
        case "auth/weak-password":
          setError(t("signUp.passwordTooWeak"));
          break;
        case "auth/operation-not-allowed":
          setError(t("signUp.registrationDisabled"));
          break;
        case "auth/too-many-requests":
          setError(t("signUp.tooManyRequests"));
          break;
        case "auth/network-request-failed":
          setError(t("signUp.networkError"));
          break;
        default:
          setError(t("signUp.unknownError"));
          break;
      }
    }
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    setGoogleError("");

    try {
      await signInWithGoogle();
      navigate(`/Panel`, { replace: true });
    } catch (error) {
      setGoogleError(t("signIn.errors.googleSigninError"));
    }
  };

  const calculatePasswordStrength = (password) => {
    if (password.length < 6) return "red";
    if (password.length < 12) return "orange";
    return "green";
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden h-full w-full flex-col bg-muted lg:flex">
        <img
          alt="GuateCare"
          className="mx-auto w-full object-cover"
          src="/img/love.gif"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t("signUp.pageTitle")}</h1>
            <p className="text-balance text-muted-foreground">
              {t("signUp.description")}
            </p>
          </div>

          {/* Formulario para registro normal */}
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">{t("signUp.fullNameLabel")}</Label>
                <Input
                  onChange={handleChange}
                  id="displayName"
                  type="text"
                  name="displayName"
                  placeholder={t("signUp.fullNamePlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("signUp.emailLabel")}</Label>
                <Input
                  onChange={handleChange}
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t("signUp.emailPlaceholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("signUp.passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t("signUp.passwordPlaceholder")}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  {t("signUp.confirmPasswordLabel")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder={t("signUp.confirmPasswordPlaceholder")}
                  onChange={handleChange}
                />
                <div className="relative">
                  <div
                    className={`h-1 w-full rounded-full ${
                      passwordStrength === "red"
                        ? "bg-red-500"
                        : passwordStrength === "orange"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="flex items-center space-x-3">
                  {/* Checkbox personalizado */}
                  <input
                    type="checkbox"
                    id="acceptedTerms"
                    name="acceptedTerms"
                    checked={user.acceptedTerms}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm">{t("signUp.acceptTerms")}</span>
                </label>
              </div>
              <Button type="submit" className="w-full">
                {t("signUp.createAccountButton")}
              </Button>
            </div>
          </form>

          {/* Formulario para registro con Google */}
          <form onSubmit={handleGoogleSignup}>
            {googleError && (
              <p className="text-red-500 text-center">{googleError}</p>
            )}
            <Button type="submit" variant="outline" className="w-full">
              {t("signUp.googleButton")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {t("signUp.alreadyHaveAccountText")}{" "}
            <Link to={`/Acceder`} className="underline">
              {t("signUp.signInLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
