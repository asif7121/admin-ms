import { isValidEmail } from '@core/utils'
import { Admin } from '@models/admin'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generate_token } from '@helpers/jwt.helper'

export const signup = async (req: Request, res: Response) => {
	try {
		const { username, email, password, role } = req.body
		if ([username, email, password].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		const existingUser = await Admin.findOne({
			$or: [{ email: email }, { username: username }],
		})
		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(400).json({ error: 'Cannot use existing email' })
			}
			if (existingUser.username === username) {
				return res.status(400).json({ error: 'Cannot use existing username' })
			}
		}
		// Validate email using Regex
		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Invalid email format' })
		}
		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await Admin.create({
			username,
			password: hashedPassword,
			email,
			role,
		})
		const payload = {
			_id: user._id.toString(),
			role: user.role,
		}
		const token = generate_token(payload)
		return res
			.status(200)
			.json({ succes: true, message: 'Admin registered successfully', token: token })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: error.message })
	}
}
