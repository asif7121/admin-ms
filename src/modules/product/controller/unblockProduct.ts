import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const unblockProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.query
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid Product Id.' })
		}
		const product = await Product.findOne({ _id: productId })
		if (!product) {
			return res.status(404).json({ error: 'Product not found..' })
		}
		if (product.isDeleted) {
			return res.status(400).json({
				error: 'This product has been deleted by the owner.',
			})
		}
		if (!product.isBlocked) {
			return res.status(400).json({
				error: 'This product already has been unblocked.',
			})
		}
        product.isBlocked = false
        product._blockedBy = undefined
		await product.save()
		return res
			.status(200)
			.json({ message: 'Product unblocked successfully', unBlockedItem: product })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
