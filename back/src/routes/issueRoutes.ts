import { getAllIssues, getIssueId, getIssuesWithFiltersController,
    register, remove, updateAssignment} from "../controller/IssueController";
import { validateIssues } from "../middleware/validateIssue";
import { validateUpdateIssues } from "../middleware/validateUpdateIssues";

import { Router } from "express";

const router = Router();

// GET /api/issues - Obtener todos los issues
router.get("/", getAllIssues);

// GET /api/issues/filter - Filtrar issues con múltiples criterios (genérico)
router.get("/filter", getIssuesWithFiltersController);

// GET /api/issues/:id - Obtener un issue por ID
router.get("/:id", getIssueId);

// POST /api/issues - Crear un nuevo issue
router.post("/register", validateIssues(), register);

// PATCH /api/issues/:id - Actualizar un issue
router.patch("/:id", validateUpdateIssues(), updateAssignment);

// DELETE /api/issues/:id - Eliminar un issue
router.delete("/:id", remove);

export default router;
