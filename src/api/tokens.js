import { Router } from "express";
import { handleGetTokens } from "../controllers/tokens.js";

const router = Router();

router.get("/api/tokens", handleGetTokens);

export default router;
