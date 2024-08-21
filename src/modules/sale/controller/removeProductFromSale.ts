import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Product } from '@models/product'
import { Sale } from '@models/sale'

export const removeProductFromSale = async (req: Request, res: Response) => {
	try {
		const { saleId, productId } = req.query

		// Validate saleId
		if (!saleId || !isValidObjectId(saleId)) {
			return res.status(400).json({ error: 'Invalid sale ID.' })
		}

		// Validate productId
		if (!productId || !isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid product ID.' })
		}

		// Find the sale details
		const sale: any = await Sale.findOne({ _id: saleId, isDeleted: false })

		if (!sale) {
			return res.status(404).json({ error: 'Sale not found or is inactive/deleted.' })
		}

		// Find the product
		const product = await Product.findOne({ _id: productId, isDeleted: false })

		if (!product) {
			return res.status(404).json({ error: 'Product not found.' })
		}

		// Remove the product from the sale's products array
		sale.products = sale.products.filter((p) => p.productId.toString()!==productId)
		await sale.save()

		// Restore the original price by removing the sale discount
		product.price = product.discount
			? product.mrp - (product.mrp * product.discount) / 100
			: product.mrp
		product.isInSale = false
		await product.save()

		return res.status(200).json({
			success: true,
			message: 'Product removed from sale and price restored.',
			data: { product: product, sale: sale },
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
