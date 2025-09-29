import { Router } from "express";
import userRoutes from "./userRoutes";
import issueRoutes from "./issueRoutes";

const router = Router();

// Rutas principales
router.use("/users", userRoutes);
router.use("/issues", issueRoutes);


router.get("/", (_req, res) => {
  res.json({ 
    message: "API funcionando correctamente 🚀",
   
  });
});

export default router;