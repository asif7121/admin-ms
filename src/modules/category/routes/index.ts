import { Router } from 'express'
import { addCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from '@modules/category/controller'

const router = Router()


router.post('/add', addCategory)
router.put('/update', updateCategory)
router.get('/get-category', getCategory)
router.get('/get-all-category', getAllCategory)
router.patch('/delete', deleteCategory)

export const categoryRouter = router
