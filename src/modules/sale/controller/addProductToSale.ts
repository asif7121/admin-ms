import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Product } from '@models/product'
import { Sale } from '@models/sale'
import moment from 'moment'

export const addProductToSale = async (req: Request, res: Response) => {
	try {
		const { saleId } = req.query
		const { productIds } = req.body

		// Validate saleId
		if (!saleId || !isValidObjectId(saleId)) {
			return res.status(400).json({ error: 'Invalid sale ID.' })
		}

		// Validate productIds
		if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
			return res.status(400).json({ error: 'Product IDs are required.' })
		}

		// Validate each productId
		for (const productId of productIds) {
			if (!isValidObjectId(productId)) {
				return res.status(400).json({ error: `Invalid product ID: ${productId}` })
			}
		}

		// Find the sale details
		const sale: any = await Sale.findOne({ _id: saleId, isDeleted: false })

		if (!sale) {
			return res.status(404).json({ error: 'Sale not found or is deleted.' })
		}

		// Validate sale dates
		const startDate = moment(sale.startDate)
		const endDate = moment(sale.endDate)


		if (startDate.isBefore(moment())) {
			return res.status(400).json({ error: 'Sale has been started, cannot add products now.' })
		}
		if (endDate.isBefore(moment())) {
			return res.status(400).json({ error: 'Sale is expired or ended.' })
		}

		const products = await Product.find({
			_id: { $in: productIds },
			isDeleted: false,
			_category: sale._category,
		})

		if (products.length === 0) {
			return res.status(404).json({ error: 'No products found with the given IDs.' })
		}
		if (products.length !== productIds.length) {
			return res
				.status(404)
				.json({ error: "Some products does not belong to the sale's category" })
		}
		// Update product prices based on the saleDiscount
		const updatedProducts = await Promise.all(
			products.map(async (product) => {
				// Check if the product is already in the sale
				const isProductInSale = sale.products.some((saleProduct) => {
					return saleProduct?.productId?.toString() === product._id.toString()
				})

				if (isProductInSale) {
					return res
						.status(400)
						.json({ error: `Product ${product.name} is already in the sale` })
				}
				// Add the product to the sale's products array
				sale.products.push({
					productId: product._id,
					productName: product.name,
					productMrp: product.mrp,
					productPrice: product.price,
					productCategory: product._category,
				})
				return product
			})
		)
		// Save the sale with the updated products
		await sale.save()
		return res.status(200).json({
			success: true,
			message: `${updatedProducts.length} products added to the Sale.`,
			sale: sale,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
