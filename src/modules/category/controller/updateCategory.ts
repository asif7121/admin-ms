import { Category } from "@models/category";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";






export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const { name } = req.body
        const { categoryId } = req.query
        if (!isValidObjectId(categoryId)) {
			return res.status(400).json({ error: 'Invalid Category Id.' })
		}
        const category = await Category.findOne({ _id: categoryId, _createdBy: _id })
        if (!category) {
            return res.status(400).json({ error: 'No category available.' })
        }
        if (category.isDeleted) {
            return res.status(403).json({error:"This category has been deleted, you cannot update it's property"})
        }
        category.name = name
        await category.save()
        return res.status(200).json({message:'Updated successfully', data:category})
    } catch (error) {
        console.log(error)
		return res.status(500).json({ error: error.message })
    }
}