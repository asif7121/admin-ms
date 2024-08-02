import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const getBundle = async (req: Request, res: Response) => {
	try {
		const { bundleId }: any = req.query

		if (!mongoose.isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle id' })
		}

		const bundle = await Bundle.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(bundleId),
					isDeleted: false,
					isBlocked: false,
				},
			},
			{
				$lookup: {
					from: 'products', // The collection name for products
					localField: '_products',
					foreignField: '_id',
					as: 'products',
				},
			},
			{
				$project: {
					_id: 1,
					name: 1,
					price: 1,
					discount: 1,
					_createdBy: 1,
					products: {
						$map: {
							input: '$products',
							as: 'product',
							in: {
								_id: '$$product._id',
								name: '$$product.name',
								price: '$$product.price',
							},
						},
					},
				},
			},
		])

		if (!bundle || bundle.length === 0) {
			return res.status(404).json({ error: 'Bundle not found' })
		}
		return res.status(200).json({ success: true, data: bundle[0] })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
