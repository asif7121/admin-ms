import { productValidationSchema } from '@core/joi/productSchemaValidation'
import { Category } from '@models/category'
import { Product } from '@models/product'
import { Request, Response } from 'express'





export const addProduct = async (req: Request, res: Response) => {
	try {
		const { _id, role }= req.user
		const { name, description, mrp, discount, _category, stockAvailable } = req.body
		const { error } = productValidationSchema.validate(req.body)
		if (error) {
			return res.status(400).json({ error: error.details[0].message })
		}
		const category = await Category.findById(_category)
		if (!category || category.isDeleted === true) {
			return res.status(400).json({ error: 'Invalid category' })
		}
		const finalPrice = discount ? mrp - (mrp * discount) / 100 : mrp

		const product = await Product.create({
			name,
			price: finalPrice,
			description,
			mrp,
			discount,
			_category,
			stockAvailable,
			_createdBy: {
				_id: _id,
				role: role
			},
		})
		return res.status(201).json({ success: true, data: product })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
