import { Product } from '@models/product'
import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'

export const getAllProduct = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, search, category } = req.query
		const pageNumber = parseInt(page as string)
		const limitNumber = parseInt(limit as string)

		// Create the initial match filter
		const matchFilter: any = { isBlocked: false, isDeleted: false }
		if (search) {
			matchFilter.$or = [{ name: { $regex: search, $options: 'i' } }]
		}
		if (category) {
			matchFilter['category.name'] = { $regex: category, $options: 'i' }
		}

		// Aggregation pipeline to fetch products
		const products = await Product.aggregate([
			{
				$match: matchFilter,
			},
			{
				$lookup: {
					from: 'categories',
					localField: '_category',
					foreignField: '_id',
					as: 'category',
				},
			},
			{ $unwind: '$category' },

			{
				$facet: {
					metadata: [{ $count: 'total' }],
					data: [
						{ $sort: { name: 1 } },
						{ $skip: (pageNumber - 1) * limitNumber },
						{ $limit: limitNumber },
						{
							$lookup: {
								from: 'bundles',
								localField: '_id',
								foreignField: '_products',
								as: 'bundleDetails',
							},
						},
						{
							$unwind: {
								path: '$bundleDetails',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: 1,
								name: 1,
								price: 1,
								mrp: 1,
								discount: 1,
								description: 1,
								stockAvailable: 1,
								category: '$category.name',
								platformDiscount: {
									$cond: {
										if: { $gt: ['$platformDiscount', null] },
										then: '$platformDiscount',
										else: '$$REMOVE',
									},
								},
								_createdBy: 1,
								bundleDetails: {
									_id: '$bundleDetails._id',
									name: '$bundleDetails.name',
									price: '$bundleDetails.price',
									products: '$bundleDetails._products',
								},
							},
						},
					],
				},
			},
		])

		const totalItems = products[0]?.metadata[0]?.total || 0
		const paginatedData = products[0]?.data || []

		// Fetch product details within bundles if they exist
		if (search) {
			const productIds = await Product.find(
				{ name: { $regex: search, $options: 'i' } },
				{ _id: 1 }
			).lean()
			const bundlesWithProduct = await Bundle.aggregate([
				{
					$match: {
						_product: { $in: productIds.map((product) => product._id) },
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
					$project: {
						_id: 1,
						name: 1,
						price: 1,
						products: {
							_id: '$productDetails._id',
							name: '$productDetails.name',
							price: '$productDetails.price',
						},
					},
				},
			])

			if (bundlesWithProduct.length) {
				paginatedData.push(...bundlesWithProduct)
			}
		}

		return res.status(200).json({
			success: true,
			page: pageNumber,
			itemsPerPage: limitNumber,
			totalItems,
			totalPages: Math.ceil(totalItems / limitNumber),
			data: paginatedData,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
