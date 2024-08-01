import { Bundle } from '@models/bundle'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import _ from 'lodash'

export const removeProductFromBundle = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { bundleId, productId } = req.query

		// Validate bundleId and productId
		if (!isValidObjectId(bundleId) ) {
			return res.status(400).json({ error: 'Invalid bundle  ID.' })
		}
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid product ID.' })
		}

		// Find the bundle
		const bundle = await Bundle.findOne({ _id: bundleId, '_createdBy._id': _id })
		if (!bundle) {
			return res.status(400).json({
				error: 'Invalid bundle ID or you do not have permission to access this bundle.',
			})
		}

		// Check if the product exists in the bundle
		const productIndex = _.findIndex(
			bundle._products,
			(prodId) => prodId.toString() === productId
		)
		if (productIndex === -1) {
			return res.status(400).json({ error: 'Product not found in the bundle.' })
		}

		// Remove the product from the bundle
		_.pullAt(bundle._products, productIndex)

		// Recalculate the total price
		const remainingProducts = await Product.find({ _id: { $in: bundle._products } })

		const totalPrice = _.sumBy(remainingProducts, 'price')

		// Apply the discount if it exists
		const finalPrice = bundle.discount
			? totalPrice - (totalPrice * bundle.discount) / 100
			: totalPrice
		bundle.price = finalPrice

		// Save the updated bundle
		await bundle.save()

		return res.status(200).json({ success: true, data: bundle })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
