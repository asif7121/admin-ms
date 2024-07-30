
import { adminRouter } from "@modules/admin/routes";
import { categoryRouter } from "@modules/category/routes";
import { discountRouter } from "@modules/discount/routes";
import { Router } from "express";



const router = Router()

router.use('/', adminRouter)
router.use('/category', categoryRouter)
router.use('/discount', discountRouter)


export default router