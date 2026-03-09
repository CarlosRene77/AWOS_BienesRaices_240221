// routes/socialRoutes.js
import express from "express";
import { 
    facebookAuth, 
    facebookCallback,
    googleAuth, 
    googleCallback 
} from "../controllers/socialController.js";

const router = express.Router();

// Rutas para Facebook
router.get("/facebook", facebookAuth);
router.get("/facebook/callback", facebookCallback);

// Rutas para Google
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;