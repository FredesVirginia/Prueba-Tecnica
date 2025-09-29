

import { register, login, getUsers } from "../controller/UserController";
import { validateRegister, validateLogin } from "../middleware/validateUser";
import { Router } from "express";

const router = Router();

// GET /api/users - Obtener todos los usuarios
router.get("/", getUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user with ID: ${id}` });
});

// POST /api/users/register - Crear un nuevo usuario
router.post("/register", validateRegister(), register);

// POST /api/users/login - Login de usuario
router.post("/login", validateLogin(), login);

// PUT /api/users/:id - Actualizar un usuario
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Update user with ID: ${id}` });
});

// DELETE /api/users/:id - Eliminar un usuario
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete user with ID: ${id}` });
});

export default router;