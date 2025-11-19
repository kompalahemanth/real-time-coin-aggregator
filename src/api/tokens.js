import { Router } from "express";
import { handleGetTokens } from "../controllers/tokens.js";

const router = Router();

router.get("/tokens", handleGetTokens);

export default router;
