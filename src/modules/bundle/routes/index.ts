import { Router } from 'express'
import {
	addBundle,
	deleteBundle,
	getAllBundle,
	getBundle,
	removeProductFromBundle,
	updateBundle,
} from '@modules/bundle/controller'

const router = Router()

router.post('/add-bundle', addBundle)
router.get('/get-bundle', getBundle)
router.get('/get-all', getAllBundle)
router.patch('/update', updateBundle)
router.patch('/delete', deleteBundle)
router.patch('/remove-product', removeProductFromBundle)

export const bundleRouter = router
