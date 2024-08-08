import jwt from 'jsonwebtoken'




export const generate_token = (payload:any): string => {
   
    const token = jwt.sign(
		{
			_id: payload
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE }
	)

    return token
}