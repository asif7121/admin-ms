import { Bundle } from '@models/bundle'
import { Product } from '@models/product'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const addBundle = async (req: Request, res: Response) => {
	try {
		const { _id, role } = req.user
		const { name, productsId, discount } = req.body

		// Convert productsId to array of ObjectId
		const productIds = productsId.map((id: string) => new mongoose.Types.ObjectId(id))

		// Find products by their _id
		const products = await Product.find({
			_id: { $in: productIds },
            isDeleted: false,
            isBlocked: false,
        })
        
		// console.log(products)
		if (products.length !== productsId.length) {
			return res.status(404).json({ error: 'Some products not found' })
		}

		// Calculate the total price of the products
		const totalPrice = products.reduce((sum, product) => sum + product.price, 0)

		// Apply the discount if provided
		const finalPrice = discount ? totalPrice - (totalPrice * discount) / 100 : totalPrice

		// Create the bundle with the calculated price
		const bundle = await Bundle.create({
			name,
			price: finalPrice,
			_products: productIds,
			discount,
			_createdBy: {
				_id: _id,
				role: role,
			},
		})

		return res.status(201).json({ success: true, data: bundle })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
