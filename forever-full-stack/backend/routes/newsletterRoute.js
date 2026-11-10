import express from "express";
import { listSubscribers, subscribe } from "../controllers/newsletterController.js";
import adminAuth from "../middleware/adminAuth.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribe);
newsletterRouter.get("/subscribers", adminAuth, listSubscribers);

export default newsletterRouter;
