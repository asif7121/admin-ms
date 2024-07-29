import { Admin } from "@models/admin";
import { Category } from "@models/category";
import { Request, Response } from "express";






export const addCategory = async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const { name } = req.body
        if (!name) {
            return res.status(400).json({error:'Please provide category name...'})
        }
        const user = await Admin.findById(_id)
        if (!user) {
            return res.status(400).json({ error: 'Invalid user access.' })
        }
        const category = await Category.create({
            name,
            _createdBy: _id
        })
        return res.status(201).json({success:true,message:'Category added successfully', data: category})
    } catch (error) {
        console.log(error)
		return res.status(500).json({ error: error.message })
    }
}