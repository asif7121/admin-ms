import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Sale } from '@models/sale'

export const updateSaleDetails = async (req: Request, res: Response) => {
	try {
		const { saleId } = req.query
		const { description, saleDiscount } = req.body

		// Validate saleId
		if (!saleId || !isValidObjectId(saleId)) {
			return res.status(400).json({ error: 'Invalid sale ID.' })
		}
		
		if (!description && !saleDiscount) {
			return res.status(400).json({ error: 'No fields provided for update.' })
		}
		// Find the sale
		const sale = await Sale.findOne({ _id: saleId, isDeleted: false})
		if (!sale) {
			return res.status(404).json({ error: 'Sale not found or is deleted.' })
		}

		// Validate and update description if provided
		if (description !== undefined) {
			if (typeof description !== 'string' || description.trim() === '') {
				return res
					.status(400)
					.json({ error: 'Description must be a valid non-empty string.' })
			}
			sale.description = description
		}

		// Validate and update saleDiscount if provided
		if (saleDiscount !== undefined) {
			if (typeof saleDiscount !== 'number' || saleDiscount < 0 || saleDiscount > 100) {
				return res
					.status(400)
					.json({ error: 'Sale discount must be a valid number between 0 and 100.' })
			}
			sale.saleDiscount = saleDiscount
		}

		// Save the updated sale
		await sale.save()

		return res.status(200).json({
			success: true,
			message: 'Sale details updated successfully.',
			data: sale,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
