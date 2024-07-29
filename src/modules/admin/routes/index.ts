import { Router } from "express";
import { login, signup } from "@modules/admin/controller";





const router = Router()

router.post('/signup', signup)
router.post('/login', login)





export const adminRouter = router