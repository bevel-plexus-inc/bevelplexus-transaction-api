import HealthController from "@controllers/healthController";
import express from "express";

const router = express.Router();
const healthController = new HealthController();

router.get("/", healthController.healthCheck);

export default router;
