import QuidaxController from "@controllers/quidaxController";
import express from "express";

const router = express.Router();
const quidaxController = new QuidaxController();

router.post("/hook", quidaxController.eventListener);

export default router;
