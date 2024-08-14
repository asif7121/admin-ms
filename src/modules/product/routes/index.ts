import { Router } from "express";
import {  blockProduct, getAllBlockedProduct, getAllProduct, getProduct, unblockProduct } from "@modules/product/controller";




const router = Router()


router.get('/get-detail', getProduct)
router.get('/all-products', getAllProduct)
router.get('/get-all-blocked', getAllBlockedProduct)
router.patch('/block',blockProduct)
router.patch('/unblock',unblockProduct)


export const  productRouter = router