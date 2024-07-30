import { Router } from 'express'
import { verify_token } from '@middlewares/verifyJwt'
import { addDiscount, deleteDiscount, getAllDiscount, getDiscount, updateDiscount } from '@modules/discount/controller'

const router = Router()

router.use(verify_token)
router.post('/add', addDiscount)
router.put('/update', updateDiscount)
router.get('/get-discount', getDiscount)
router.get('/get-all-discount', getAllDiscount)
router.patch('/delete', deleteDiscount)

export const discountRouter = router
