import { AdminDiscount } from '@models/discount'
import { Request, Response } from 'express'

export const getAllDiscount = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { page = 1, limit = 10, search } = req.query
		const pageNumber = parseInt(page as string)
		const limitNumber = parseInt(limit as string)
		const searchFilter = search
			? { _createdBy: _id, name: { $regex: search, $options: 'i' } }
			: { _createdBy: _id }
		const data = await AdminDiscount.find(searchFilter)
			.sort({ name: 1 })
			.skip((pageNumber - 1) * limitNumber)
			.limit(limitNumber)
		if (!data) {
			return res.status(400).json({ error: 'No category available.' })
		}
		const totalData = await AdminDiscount.countDocuments(searchFilter)
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
