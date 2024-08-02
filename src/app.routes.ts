
import { verify_token } from "@middlewares/verifyJwt";
import { adminRouter } from "@modules/admin/routes";
import { bundleRouter } from "@modules/bundle/routes";
import { categoryRouter } from "@modules/category/routes";
import { discountRouter } from "@modules/discount/routes";
import { productRouter } from "@modules/product/routes";
import { Router } from "express";



const router = Router()

router.use('/', adminRouter)
router.use(verify_token)
router.use('/category', categoryRouter)
router.use('/discount', discountRouter)
router.use('/bundle', bundleRouter)
router.use('/product',productRouter )


export default router