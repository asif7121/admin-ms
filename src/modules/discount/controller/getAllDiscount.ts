import { Discount } from '@models/discount'
import { Request, Response } from 'express'

export const getAllDiscount = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10 } = req.query
		const pageNumber = parseInt(page as string)
		const limitNumber = parseInt(limit as string)
		const searchFilter = { isDeleted: false }

		// Aggregation pipeline to fetch discounts along with product and bundle details
		const data = await Discount.aggregate([
			{
				$match: searchFilter,
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
					productDetails: {
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
					bundleDetails: {
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
			{
				$sort: { startDate: 1 },
			},
			{
				$skip: (pageNumber - 1) * limitNumber,
			},
			{
				$limit: limitNumber,
			},
		])

		const totalData = await Discount.countDocuments(searchFilter)
		return res.status(200).json({
			success: true,
			page: pageNumber,
			itemsPerPage: limitNumber,
			totalItems: totalData,
			totalPages: Math.ceil(totalData / limitNumber),
			data: data,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
