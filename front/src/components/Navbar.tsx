import { FaUserSecret } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { Dropdown } from "rsuite";
import { ACCESS_TOKEN_KEY } from "../pages/LoginPage";
import { useUserStore } from "../store/useUserStore";

export default function Navbar() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const UserDropdownTitle = () => (
    <div className="flex items-center cursor-pointer">
      <FaUserSecret className="text-green-700 text-2xl" />
      <div className="text-green-700 text-lg font-bold ml-2">
        {user?.name || "Usuario"}
      </div>
    </div>
  );

  const handleLogout = () => {
    secureLocalStorage.removeItem(ACCESS_TOKEN_KEY);

    navigate("/");
  };

  return (
    <div className="bg-white rounded-xl h-15 flex justify-between items-center px-5 mx-5">
      <div className="text-green-700 text-lg font-bold">Bug Hunters</div>
      <div className="flex items-center">
        <Dropdown title={<UserDropdownTitle />} placement="bottomEnd">
          <Dropdown.Item>Mi Perfil</Dropdown.Item>
          <Dropdown.Item>Configuración</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
}
