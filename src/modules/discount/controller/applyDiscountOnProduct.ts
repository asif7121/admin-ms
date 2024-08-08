import { Discount } from '@models/discount'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import moment from 'moment'

export const applyDiscountToProducts = async (req: Request, res: Response) => {
	try {
		const { discountId, productIds } = req.body
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}
		// Validate that productsId is an array of valid ObjectId strings
		if (!Array.isArray(productIds) || productIds.some((id) => !isValidObjectId(id))) {
			return res.status(400).json({ error: 'Invalid product IDs.' })
		}
		// Remove duplicate IDs
		const uniqueProductIds = [...new Set(productIds)]

		const discount = await Discount.findById(discountId)
		if (!discount) {
			return res.status(404).json({ error: 'Discount not found' })
		}
		if (discount.isDeleted) {
			return res.status(400).json({ error: 'This discount has been deleted.' })
		}
		// Check if the discount is expired
		const currentDate = moment()
		if (currentDate.isBefore(discount.startDate) || currentDate.isAfter(discount.endDate)) {
			return res.status(400).json({ error: 'Discount is expired..' })
		}
		// Filter out product IDs that are already associated with this discount
		const newProductIds = uniqueProductIds.filter((id) => !discount._products.toString().includes(id))

		if (newProductIds.length === 0) {
			return res
				.status(400)
				.json({ error: 'All provided products already have this discount.' })
		}
		if (discount.type === 'mrp') {
			await Product.updateMany(
				{ _id: { $in: newProductIds }, isDeleted: false, isBlocked: false },
				[
					{ $set: { platformDiscount: discount.value } },
					{
						$set: {
							discountedPrice: {
								$subtract: ['$mrp', { $multiply: ['$mrp', discount.value / 100] }],
							},
						},
					},
				]
			)
		} else if (discount.type === 'price') {
			await Product.updateMany(
				{ _id: { $in: newProductIds }, isDeleted: false, isBlocked: false },
				[
					{ $set: { platformDiscount: discount.value } },
					{
						$set: {
							discountedPrice: {
								$subtract: [
									'$price',
									{ $multiply: ['$price', discount.value / 100] },
								],
							},
						},
					},
				]
			)
		}

		discount._products = [...discount._products, ...newProductIds]
		await discount.save()

		return res.status(200).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
