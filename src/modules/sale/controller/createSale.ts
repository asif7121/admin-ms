import { Category } from "@models/category";
import { Sale } from "@models/sale";
import { Request, Response } from "express";
import moment from "moment";
import { isValidObjectId } from "mongoose";



export const createSale = async (req: Request, res: Response) => {
    try {
		const { _id } = req.user
		const { description, _category, startDate, endDate, saleDiscount } = req.body
		
		if (!description) {
			return res.status(400).json({ error: 'description is required.' })
		}
		if (!_category) {
			return res.status(400).json({ error: '_category is required.' })
		}
		if (!startDate) {
			return res.status(400).json({ error: 'startDate is required.' })
		}
		if (!endDate) {
			return res.status(400).json({ error: 'endDate is required.' })
        }
        if (isNaN(saleDiscount) || saleDiscount <= 0 || saleDiscount > 100) {
			return res
				.status(400)
				.json({
					error: 'Provide discount value that must be a number between 1 and 100',
				})
		}
		if (!isValidObjectId(_category)) {
			return res.status(400).json({ error: '_category is a invalid ID.' })
		}
		// Parse the dates using the 'yyyy-mm-dd-hh-mm-ss' format
		const format = 'YYYY-MM-DD-HH-mm-ss'
		const start = moment(startDate, format, true)
		const end = moment(endDate, format, true)

		// Check if the dates are valid
		if (!start.isValid()) {
			return res
				.status(400)
				.json({ error: "Invalid start date format. Use 'YYYY-MM-DD-HH-mm-ss'" })
		}
		if (!end.isValid()) {
			return res
				.status(400)
				.json({ error: "Invalid end date format. Use 'YYYY-MM-DD-HH-mm-ss'" })
		}

		// Validate startDate and endDate
		if (start.isBefore(moment())) {
			return res.status(400).json({ error: 'Start date cannot be in the past.' })
		}
		if (end.isBefore(start)) {
			return res.status(400).json({ error: 'End date cannot be before start date.' })
		}
		const category = await Category.findById(_category)
		if (!category) {
			return res.status(404).json({ error: 'Category not found' })
		}
		if (category.isDeleted) {
			return res.status(400).json({error:`The category ${category.name} has been deleted.`})
		}
		// Create the new Sale
		const sale = new Sale({
			name: category.name,
			description,
			_category: category._id,
			startDate:start.toDate(),
			endDate: end.toDate(),
			saleDiscount: saleDiscount || 0,
			_createdBy: _id, 
		})

		// Save the Sale to the database
		await sale.save()

		// Return success response with the newly created Sale
		return res.status(201).json({
			success: true,
			message: 'Sale created successfully.',
			data: sale,
		})
	} catch (error) {
        console.log(error)
		return res.status(500).json({ error: error.message })
    }
}