
import { Discount } from '@models/discount'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const getDiscount = async (req: Request, res: Response) => {
	try {
		const { discountId } = req.query

		// Validate discountId
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}

		// Use aggregation to get discount details along with associated products and bundles
		const discount = await Discount.aggregate([
			{
				$match: {
					_id: discountId,
					isDeleted: false,
				},
			},
			{
				$lookup: {
					from: 'products',
					localField: '_products',
					foreignField: '_id',
					as: 'productDetails',
				},
			},
			{
				$lookup: {
					from: 'bundles',
					localField: '_bundles',
					foreignField: '_id',
					as: 'bundleDetails',
				},
			},
			{
				$project: {
					_id: 1,
					type: 1,
					value: 1,
					startDate: 1,
					endDate: 1,
					isDeleted: 1,
					products: {
						$map: {
							input: '$productDetails',
							as: 'product',
							in: {
								_id: '$$product._id',
								name: '$$product.name',
								price: '$$product.price',
							},
						},
					},
					bundles: {
						$map: {
							input: '$bundleDetails',
							as: 'bundle',
							in: {
								_id: '$$bundle._id',
								name: '$$bundle.name',
								price: '$$bundle.price',
							},
						},
					},
				},
			},
		])

		// Check if discount was found
		if (!discount || discount.length === 0) {
			return res.status(404).json({ error: 'Discount not found.' })
		}

		return res.status(200).json({ success: true, data: discount[0] })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}

