import { Admin } from '@models/admin'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generate_token } from '@helpers/jwt.helper'

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		if ([email, password].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		const user = await Admin.findOne({ email })
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		const payload = {
			_id: user._id.toString(),
			role: user.role,
		}
		const token = generate_token(payload)
		return res
			.status(200)
			.json({ succes: true, message: 'Admin logged in successfully', token: token })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: error.message })
	}
}
