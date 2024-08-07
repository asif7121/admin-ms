import { Router } from 'express'
import {
	addDiscount,
	applyDiscountToBundles,
	applyDiscountToProducts,
	deleteDiscount,
	getAllDiscount,
	getDiscount,
	removeDiscountFromBundles,
	removeDiscountFromProducts,
	updateDiscount,
} from '@modules/discount/controller'

const router = Router()

router.post('/add', addDiscount)
router.patch('/update', updateDiscount)
router.get('/get-discount', getDiscount)
router.get('/get-all-discount', getAllDiscount)
router.patch('/delete', deleteDiscount)
router.post('/apply/products', applyDiscountToProducts)
router.post('/apply/bundles', applyDiscountToBundles)
router.patch('/remove/products', removeDiscountFromProducts)
router.patch('/remove/bundles', removeDiscountFromBundles)

export const discountRouter = router
