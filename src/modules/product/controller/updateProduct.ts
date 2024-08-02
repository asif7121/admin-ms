import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { productId } = req.query
		const { name, mrp, discount, description } = req.body
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid Product Id.' })
		}
		const product = await Product.findOne({ _id: productId, '_createdBy._id': _id })
		if (!product) {
			return res.status(400).json({ error: 'No product available..' })
		}
		if (product.isDeleted) {
			return res.status(400).json({
				error: 'This product has been deleted by the owner.',
			})
		}
		if (product.isBlocked) {
			return res.status(400).json({
				error: 'This product has been blocked.',
			})
		}

		if (name !== undefined) product.name = name
		if (description !== undefined) product.description = description

		// Calculate the final price
		if (mrp !== undefined) {
			const finalPrice = product.discount ? mrp - (mrp * product.discount) / 100 : mrp
			product.mrp = mrp
			product.price = finalPrice
		} else if (discount !== undefined) {
			const finalPrice = product.mrp - (product.mrp * discount) / 100
			product.discount = discount
			product.price = finalPrice
		}
		await product.save()
		return res.status(200).json({ message: 'Updated successfully.', data: product })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
