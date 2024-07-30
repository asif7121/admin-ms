import { AdminDiscount } from '@models/discount'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const addDiscount = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { name, value, _product, _bundle } = req.body
		if (_product) {
			if (!isValidObjectId(_product)) {
				return res.status(400).json({ error: 'Invalid Product ID' })
			}
		}
		if (_bundle) {
			if (!isValidObjectId(_bundle)) {
				return res.status(400).json({ error: 'Invalid Bundle ID' })
			}
		}
		const discount = await AdminDiscount.create({
			value,
			name,
			_product,
			_bundle,
			_createdBy: _id,
		})
		return res.status(201).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
