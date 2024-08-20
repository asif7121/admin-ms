import { Request, Response } from 'express'
import { Sale } from '@models/sale'

export const getAllSales = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, search } = req.query

		// Parse query parameters
		const pageNumber = parseInt(page as string, 10)
		const limitNumber = parseInt(limit as string, 10)

		// Create the match filter
		const matchFilter: any = {
			isDeleted: false,
		}

		// Add search condition if search query is provided
		if (search) {
			matchFilter.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			]
		}

		// Query the database with pagination and filtering
		const sales = await Sale.aggregate([
			{ $match: matchFilter },
			{
				$facet: {
					metadata: [{ $count: 'total' }],
					data: [
						{ $sort: { name: 1 } },
						{ $skip: (pageNumber - 1) * limitNumber },
						{ $limit: limitNumber },
						{
							$project: {
								_id: 1,
								name: 1,
								description: 1,
								saleDiscount: 1,
								startDate: 1,
								endDate: 1,
                                isActive: 1,
                                isDeleted: 1,
								_category: 1,
								_createdBy: 1,
								products: 1,
							},
						},
					],
				},
			},
		])

		// Extract metadata and data from the aggregation result
		const totalItems = sales[0]?.metadata[0]?.total || 0
		const saleData = sales[0]?.data || []

		// Return the sales with pagination info
		return res.status(200).json({
			success: true,
			page: pageNumber,
			itemsPerPage: limitNumber,
			totalItems,
			totalPages: Math.ceil(totalItems / limitNumber),
			data: saleData,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
