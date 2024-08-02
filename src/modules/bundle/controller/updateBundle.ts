import { Bundle } from '@models/bundle'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import mongoose, { isValidObjectId } from 'mongoose'

export const updateBundle = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { bundleId } = req.query
		const { name, productsId, discount } = req.body

		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle Id.' })
		}

		const bundle = await Bundle.findOne({ _id: bundleId, '_createdBy._id': _id })
		if (!bundle) {
			return res.status(400).json({ error: 'No bundle found.' })
		}
		if (bundle.isDeleted) {
			return res.status(400).json({ error: 'this bundle has been deleted.' })
		}
		if (bundle.isBlocked) {
			return res.status(400).json({
				error: 'This bundle has been blocked.',
			})
		}
		let totalPrice = 0

		if (productsId) {
			// Convert productsId to array of ObjectId
			const productIds = productsId.map((id: string) => new mongoose.Types.ObjectId(id))

			// Find products by their _id and _createdBy._id
			const products = await Product.find({_id: { $in: productIds }, isDeleted:false, isBlocked: false})

			if (products.length !== productsId.length) {
				return res.status(404).json({ error: 'Some products not found' })
			}

			// Combine existing product IDs with the new ones
			const combinedProductIds = [...bundle._products, ...productIds]

			// Find all products including the existing ones
			const allProducts = await Product.find({_id: { $in: combinedProductIds }})

			// Calculate the total price of all products
			totalPrice = allProducts.reduce((sum, product) => sum + product.price, 0)

			bundle._products = combinedProductIds
		} else {
			// Calculate the total price of the existing products
			const existingProducts = await Product.find({_id: { $in: bundle._products }})
			totalPrice = existingProducts.reduce((sum, product) => sum + product.price, 0)
		}

		// Update only the provided fields
		if (name !== undefined) bundle.name = name
		if (discount !== undefined) bundle.discount = discount

		// Apply the discount if provided
		const finalPrice = bundle.discount
			? totalPrice - (totalPrice * bundle.discount) / 100
			: totalPrice
		bundle.price = finalPrice

		await bundle.save()

		return res.status(200).json({ success: true, data: bundle })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
