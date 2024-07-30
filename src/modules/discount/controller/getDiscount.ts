
import { AdminDiscount } from '@models/discount'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const getDiscount = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { discountId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid Category Id.' })
		}
		const data = await AdminDiscount.findOne({ _id: discountId, _createdBy: _id })
		if (!data) {
			return res.status(400).json({ error: 'No discount available.' })
		}
		return res.status(200).json({ success: true, data: data })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
