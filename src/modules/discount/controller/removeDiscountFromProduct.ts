import { Discount } from '@models/discount'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import _ from 'lodash'
import { isValidObjectId, Schema } from 'mongoose'

export const removeDiscountFromProducts = async (req: Request, res: Response) => {
	try {
		const { discountId, productId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}

		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid product IDs.' })
		}

		const discount = await Discount.findById(discountId)
		if (!discount) {
			return res.status(404).json({ error: 'Discount not found' })
		}
		if (discount.isDeleted) {
			return res.status(400).json({ error: 'This discount has been deleted.' })
		}

		// Check if the product exists in the discount
		const productIndex = _.findIndex(discount._products, (id) => id.toString() === productId)
		if (productIndex === -1) {
			return res.status(400).json({ error: 'Product not found in the discount.' })
		}

		// Remove the product from the discount
		discount._products = discount._products.filter((id) => id.toString() !== productId)

		const product = await Product.findById(productId)
		product.platformDiscount = undefined
		product.discountedPrice = undefined
		await product.save()
		await discount.save()

		return res.status(200).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
