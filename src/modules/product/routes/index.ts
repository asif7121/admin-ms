import { Router } from "express";
import { addProduct, blockProduct, deleteProduct, getAllBlockedProduct, getAllProduct, getProduct, unblockProduct, updateProduct } from "@modules/product/controller";




const router = Router()

router.post('/add', addProduct)
router.get('/get-detail', getProduct)
router.patch('/update', updateProduct)
router.patch('/delete', deleteProduct)
router.get('/all-products', getAllProduct)
router.get('/get-all-blocked', getAllBlockedProduct)
router.patch('/block',blockProduct)
router.patch('/unblock',unblockProduct)


export const  productRouter = router