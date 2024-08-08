import { Bundle } from '@models/bundle'
import { Discount } from '@models/discount'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const updateDiscount = async (req: Request, res: Response) => {
	try {
		const { value } = req.body
		const { discountId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}
		const discount = await Discount.findOne({ _id: discountId })
		if (!discount) {
			return res.status(400).json({ error: 'No discount available.' })
		}
		if (discount.isDeleted) {
			return res
				.status(403)
				.json({ error: "This discount has been deleted, you cannot update it's property" })
		}

		if (!value || isNaN(value) || value < 0 || value >= 100) {
			return res.status(400).json({ error: 'Please provide a valid value between 0 to 100' })
		}
		// Update related products
		if (discount._products && discount._products.length > 0) {
			await Promise.all(
				discount._products.map(async (productId) => {
					if (isValidObjectId(productId)) {
						const product = await Product.findById(productId)
						if (product) {
							if (discount.type === 'price') {
								product.platformDiscount = value
								product.discountedPrice = product.price - product.price * (value / 100)
								await product.save()
							} else if (discount.type === 'mrp') {
								product.platformDiscount = value
								product.discountedPrice = product.mrp - product.mrp * (value / 100)
								await product.save()
							}
						}
					}
				})
			)
		}

		// Update related bundles
		if (discount._bundles && discount._bundles.length > 0) {
			await Promise.all(
				discount._bundles.map(async (bundleId) => {
					if (isValidObjectId(bundleId)) {
						const bundle = await Bundle.findById(bundleId)
						if (bundle && discount.type === 'price') {
							bundle.platformDiscount = value
							bundle.discountedPrice = bundle.price - bundle.price * (value / 100)
							await bundle.save()
						}
					}
				})
			)
		}
		discount.value = value
		await discount.save()
		return res.status(200).json({ message: 'Updated successfully', data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
