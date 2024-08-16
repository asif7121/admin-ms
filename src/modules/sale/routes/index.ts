import { Router } from "express";
import { addProductToSale, createSale, deleteSale, getAllSales, getSaleDetails, removeProductFromSale } from "@modules/sale/controller";






const router = Router()

router.post('/create', createSale)
router.patch('/add-to-sale', addProductToSale)
router.patch('/delete', deleteSale)
router.patch('/remove-from-sale', removeProductFromSale)
router.get('/get', getSaleDetails)
router.get('/get-all', getAllSales)




export const saleRouter = router