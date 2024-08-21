import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Product } from '@models/product'
import { Sale } from '@models/sale'

export const deleteSale = async (req: Request, res: Response) => {
	try {
		const { saleId } = req.query

		// Validate saleId
		if (!saleId || !isValidObjectId(saleId)) {
			return res.status(400).json({ error: 'Invalid sale ID.' })
		}

		// Find the sale
		const sale:any = await Sale.findById(saleId)
		if (!sale) {
			return res.status(404).json({ error: 'Sale not found.' })
		}
        if (sale.isDeleted) {
			return res.status(400).json({ error: 'Sale already has been deleted.' })
		}
		// Restore product prices based on original discount or MRP
		const productIds = sale.products.map((product) => product.productId)

		// Find and update each product
		const products = await Product.find({ _id: { $in: productIds } })

		for (const product of products) {
			// Restore the original price by applying the original discount, if any
			product.price = product.discount
				? product.mrp - (product.mrp * product.discount) / 100
				: product.mrp
			product.isInSale = false
			await product.save()
		}

		// Remove the products from the sale
		sale.products = []
		// Mark the sale as deleted
		sale.isDeleted = true
		await sale.save()

		return res.status(200).json({
			success: true,
			message: `Sale deleted and product's prices restored to original values.`,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
