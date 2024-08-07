import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'
import moment from 'moment'
import _ from 'lodash'
import { Discount } from '@models/discount'
import { isValidObjectId } from 'mongoose'

export const removeDiscountFromBundles = async (req: Request, res: Response) => {
	try {
		const { discountId, bundleId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}
		// Validate that bundleIds is an array of valid ObjectId strings
		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle ID.' })
		}

		const discount = await Discount.findById(discountId)

		if (!discount) {
			return res.status(404).json({ error: 'Discount not found' })
		}
		if (discount.isDeleted) {
			return res.status(400).json({ error: 'This discount has been deleted.' })
		}
		// Check if the bundle exists in the discount
		const bundleIndex = _.findIndex(discount._bundles, (id) => id.toString() === bundleId)
		if (bundleIndex === -1) {
			return res.status(400).json({ error: 'Bundle not found in the discount.' })
		}

		// Remove the bundle from the discount
		discount._bundles = discount._bundles.filter((id) => id.toString() !== bundleId)

		const bundle = await Bundle.findById(bundleId)
		bundle.platformDiscount = undefined
		bundle.discountedPrice = undefined
		await bundle.save()
		await discount.save()

		return res.status(200).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
