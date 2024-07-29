import { Router } from 'express'
import { addCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from '@modules/category/controller'
import { verify_token } from '@middlewares/verifyJwt'

const router = Router()


router.use(verify_token)
router.post('/add', addCategory)
router.put('/update', updateCategory)
router.get('/get-category', getCategory)
router.get('/get-all-category', getAllCategory)
router.patch('/delete', deleteCategory)

export const categoryRouter = router
