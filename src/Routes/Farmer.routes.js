import { Router } from "express";
import { Add_Farmer, Get_All_Farmers } from "../Controllers/Farmer.controller.js";

const router = Router();

router.route("/add").post(Add_Farmer);
router.route("/all").get(Get_All_Farmers);

export default router;