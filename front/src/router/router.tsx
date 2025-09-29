import { useEffect, type JSX } from "react";
import { isExpired } from "react-jwt";
import { Navigate, Route, Routes } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import LoginPage, { ACCESS_TOKEN_KEY } from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import { useUserStore } from "../store/useUserStore";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
  
      <Route
        path="/dashboard/*"
        element={
          <IsRequired>
            <MainPage />
          </IsRequired>
        }
      />

 

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
interface Props {
  children: JSX.Element;
}


interface Props {
  children: JSX.Element;
}
const intervalRefresh = 2 * 60 * 60 * 1000; // 2 horas

const IsRequired = ({ children }: Props): JSX.Element => {
  const { user } = useUserStore();
  let token = (secureLocalStorage.getItem(ACCESS_TOKEN_KEY) as string | null) ?? "1";

  useEffect(() => {
    const interval = setInterval(() => {
      token = (secureLocalStorage.getItem(ACCESS_TOKEN_KEY) as string | null) ?? "";
    }, intervalRefresh);
    return () => clearInterval(interval);
  }, []);

  console.log(user);
  if (!user || !user._id || isExpired(token)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
