import { Router } from 'express'
import {
	addBundle,
	blockBundle,
	deleteBundle,
	getAllBlockedBundle,
	getAllBundle,
	getBundle,
	removeProductFromBundle,
	unblockBundle,
	updateBundle,
} from '@modules/bundle/controller'

const router = Router()

router.post('/add-bundle', addBundle)
router.get('/get-bundle', getBundle)
router.get('/get-all', getAllBundle)
router.patch('/update', updateBundle)
router.patch('/delete', deleteBundle)
router.patch('/remove-product', removeProductFromBundle)
router.patch('/block', blockBundle)
router.patch('/unblock', unblockBundle)
router.get('/get-all-blocked', getAllBlockedBundle)

export const bundleRouter = router
