import { Discount } from '@models/discount'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const updateDiscount = async (req: Request, res: Response) => {
	try {
		
		const { discountCode, value } = req.body
		const { discountId } = req.query
		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount Id.' })
		}
		const discount = await Discount.findOne({ _id: discountId })
		if (!discount) {
			return res.status(400).json({ error: 'No discount available.' })
		}
		if (discount.isDeleted) {
			return res
				.status(403)
				.json({ error: "This discount has been deleted, you cannot update it's property" })
		}
		if(discount.discountCode !== undefined) discount.discountCode = discountCode
		if(discount.value !== undefined) discount.value = value
		await discount.save()
		return res.status(200).json({ message: 'Updated successfully', data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
