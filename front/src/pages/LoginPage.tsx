import EyeCloseIcon from "@rsuite/icons/EyeClose";
import VisibleIcon from "@rsuite/icons/Visible";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { Button, Input, InputGroup } from "rsuite";
import * as Yup from "yup";
import ARBOL from "../assets/fondoLogin.jpg";
import { login, type ICredentiales } from "../hooks/useUsers/request";
import { useUserStore } from "../store/useUserStore";
import { handleApiError } from "../utils/errorHandler";

export const ACCESS_TOKEN_KEY = "DRY";
export const REFRESH_TOKEN_KEY = "KISS";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string().email("email inválido").required("required"),
  password: Yup.string().min(6, "mínimo 6 caracteres").required("required"),
});

export default function LoginPage() {
  const [visible, setVisible] = useState(false);

  const { setUser } = useUserStore();
  const navigate = useNavigate();

  

  async function handleSubmit(values: typeof INITIAL_VALUES) {
    const trimmedValues: ICredentiales = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    try {
      const response = await login(trimmedValues);
      
      if (response.token) {
        setUser(response.user);
        secureLocalStorage.setItem(ACCESS_TOKEN_KEY, response.token);
        toast.success("¡Login exitoso!");

        navigate("/dashboard");

        console.log("Login completado y redirigido");
      }

      
    } catch (error: any) {
      console.error(`Ocurrió un Error ${error.message}`);
      
      // Mostrar mensaje específico para credenciales inválidas
      if (error.code === "INVALID_CREDENTIALS") {
        toast.error("Credenciales inválidas");
      } else {
        // Para otros errores usar el errorHandler
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
      }
    } 
  }

  console.log("Token actual:", secureLocalStorage.getItem(ACCESS_TOKEN_KEY));
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute inset-0 z-0">
        <img src={ARBOL} alt="login" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/80 md:bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl py-10 px-6 w-full max-w-sm min-h-[480px] flex flex-col justify-center">
           <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="flex flex-col items-center w-full px-10">
          <div className="mb-6 flex flex-col items-center gap-6 w-full">
            <p className="text-[24px] md:text-[35px] font-bold text-green-800 text-center">
              Bug Hunters
            </p>

            <InputGroup className="bg-white items-center w-full">
              <InputGroup.Addon>
                <FaRegUserCircle style={{ color: "#52C5FA" }} />
              </InputGroup.Addon>
              <Field
                as={Input}
                name="email"
                placeholder="Ingrese su correo electrónico"
                className="text-gray-700 bg-gray-200 pl-10 pr-4 rounded-xl py-2 w-full"
                onChange={(val: string) => setFieldValue("email", val)}
                value={values.email}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </InputGroup>

            <InputGroup className="bg-white items-center w-full">
              <InputGroup.Button onClick={() => setVisible(!visible)} className="cursor-pointer">
                {visible ? (
                  <VisibleIcon style={{ color: "#52C5FA" }} />
                ) : (
                  <EyeCloseIcon style={{ color: "#52C5FA" }} />
                )}
              </InputGroup.Button>
              <Field
                as={Input}
                name="password"
                placeholder="Ingrese su contraseña"
                type={visible ? "text" : "password"}
                className="bg-gray-200 pl-10 pr-10 rounded-xl py-2 w-full text-gray-700"
                onChange={(val: string) => setFieldValue("password", val)}
                value={values.password}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </InputGroup>
          </div>

          <Button
            type="submit"
            appearance="primary"
            disabled={!values.email || !values.password || isSubmitting}
            className={`bg-sky-400 hover:bg-sky-500 transition text-white font-semibold w-full py-3 rounded-xl
              ${!values.email || !values.password ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </Form>
      )}
    </Formik>
        </div>
      </div>
    </div>
  );
}
