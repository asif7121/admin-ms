import jwt from 'jsonwebtoken'


export interface IPayload{
    _id:string
}

export const generate_token = (payload:IPayload): string => {
   
    const token = jwt.sign(
		{
			_id: payload._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE }
	)

    return token
}