// routes/propiedadRoutes.js
import express from "express";
import { misPropiedades } from "../controllers/propiedadController.js";
import { verificarAuth } from "../middleware/auth.js";

const router = express.Router();

// Todas las rutas de propiedades requieren autenticación
router.use(verificarAuth);

router.get("/mis-propiedades", misPropiedades);

export default router;