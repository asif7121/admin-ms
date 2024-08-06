import { Discount } from '@models/discount'
import { Request, Response } from 'express'
import moment from 'moment'

export const addDiscount = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { value, startDate, endDate, discountCode } = req.body
		if (!discountCode || typeof discountCode !== 'string') {
			return res.status(400).json({ error: 'Please provide proper discount code' })
		}
		// Parse dates using 'YYYY-MM-DD' format
		const start = moment(startDate, 'YYYY-MM-DD', true)
		const end = moment(endDate, 'YYYY-MM-DD', true)
		const now = moment().startOf('day')

		// Validate dates
		if (!start.isValid() || !end.isValid()) {
			return res.status(400).json({ error: 'Invalid date format, use YYYY-MM-DD' })
		}

		if (start.isBefore(now)) {
			return res.status(400).json({ error: 'Start date cannot be in the past' })
		}

		if (end.isBefore(start)) {
			return res.status(400).json({ error: 'End date cannot be before start date' })
		}

		// Validate discount value
		if (!value || isNaN(value) || value <= 0 || value > 100) {
			return res
				.status(400)
				.json({ error: 'Provide discount value, and value must be a number between 1 and 100' })
		}

		const discount = await Discount.create({
			value,
			discountCode,
			startDate: start.toDate(),
			endDate: end.toDate(),
			_createdBy: _id,
		})

		return res.status(201).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
