
import { adminRouter } from "@modules/admin/routes";
import { categoryRouter } from "@modules/category/routes";
import { Router } from "express";



const router = Router()

router.use('/', adminRouter)
router.use('/category', categoryRouter)


export default router