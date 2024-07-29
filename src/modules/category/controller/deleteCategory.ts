import { Category } from "@models/category"
import { Request, Response } from "express"
import { isValidObjectId } from "mongoose"





export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { categoryId } = req.query
		if (!isValidObjectId(categoryId)) {
			return res.status(400).json({ error: 'Invalid Category Id.' })
		}
		const data = await Category.findOne({ _id: categoryId, _createdBy: _id })
		if (!data) {
			return res.status(400).json({ error: 'No category available.' })
        }
        data.isDeleted = true
        await data.save()
		return res.status(200).json({ success: true, data: data })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}