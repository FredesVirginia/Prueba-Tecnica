import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

// Cargar variables de entorno
dotenv.config();

// Verificar variables de entorno requeridas
const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Error: Variables de entorno requeridas no encontradas:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => {
    console.error("❌ Error de conexión a MongoDB:", err);
    process.exit(1);
  });

// Ruta principal
app.use("/", routes);

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
