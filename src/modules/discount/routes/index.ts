import { Router } from 'express'
import { addDiscount, deleteDiscount, getAllDiscount, getDiscount, updateDiscount } from '@modules/discount/controller'

const router = Router()

router.post('/add', addDiscount)
router.put('/update', updateDiscount)
router.get('/get-discount', getDiscount)
router.get('/get-all-discount', getAllDiscount)
router.patch('/delete', deleteDiscount)

export const discountRouter = router
