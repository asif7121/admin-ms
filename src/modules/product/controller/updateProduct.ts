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

		if (mrp !== undefined) {
			const mrpValue = Number(mrp)
			if (isNaN(mrpValue) || mrpValue <= 0) {
				return res.status(400).json({
					error: 'Discount must be a number greater than 0.',
				})
			}
			product.mrp = mrpValue
			const finalPrice = product.discount
				? product.mrp - (product.mrp * product.discount) / 100
				: product.mrp
			product.price = finalPrice
		} // Validate and update discount if provided
		else if (discount !== undefined) {
			const discountValue = Number(discount)
			if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
				return res.status(400).json({
					error: 'Discount must be a number greater than 0 and less than or equal to 100.',
				})
			}
			product.discount = discountValue
			const finalPrice = product.mrp - (product.mrp * product.discount) / 100
			product.price = finalPrice
		}
		await product.save()
		return res.status(200).json({ message: 'Updated successfully.', data: product })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
