import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { Sale } from '@models/sale'

export const getSaleDetails = async (req: Request, res: Response) => {
	try {
		const { saleId } = req.query

		// Validate saleId
		if (!saleId || !isValidObjectId(saleId)) {
			return res.status(400).json({ error: 'Invalid sale ID.' })
		}

		// Find the sale details
		const sale = await Sale.findById(saleId)

		if (!sale) {
			return res.status(404).json({ error: 'Sale not found.' })
		}
		if (sale.isDeleted) {
			return res.status(400).json({ error: 'Sale is deleted.' })
		}
		// Return sale details
		return res.status(200).json({
			success: true,
			sale: sale,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
