import { Bundle } from '@models/bundle'
import { Discount } from '@models/discount'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const deleteDiscount = async (req: Request, res: Response) => {
	try {
		const { discountId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}
		const discount = await Discount.findById(discountId)
		if (!discount) {
			return res.status(400).json({ error: 'No discount available.' })
		}
		if (discount.isDeleted) {
			return res.status(400).json({ error: 'This discount already has been deleted.' })
		}
		if (discount._products && discount._products.length > 0) {
			await Promise.all(
				discount._products.map(async (productId) => {
					if (isValidObjectId(productId)) {
						const product = await Product.findById(productId)
						if (product) {
							product.platformDiscount = undefined
							product.price = product.discount
								? product.mrp - (product.mrp * product.discount) / 100
								: product.mrp
							await product.save()
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
						if (bundle) {
							bundle.platformDiscount = undefined
							bundle.price = bundle.discount
								? bundle.mrp - (bundle.mrp * bundle.discount) / 100
								: bundle.mrp

							await bundle.save()
						}
					}
				})
			)
		}
		discount.isDeleted = true
		discount._products = []
		discount._bundles = []
		await discount.save()
		return res.status(200).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
