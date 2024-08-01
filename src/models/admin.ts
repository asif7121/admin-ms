import { Document, model, Schema } from 'mongoose'

interface IAdmin extends Document {
	username: string
	email: string
	password: string
	isBlocked: boolean
	_blockedBy: Schema.Types.ObjectId
	role: 'admin' | 'superAdmin'
}

const adminSchema: Schema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['admin', 'superAdmin'],
			default: 'admin',
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		_blockedBy: {
			type: Schema.Types.ObjectId,
			default: undefined,
		},
	},
	{ timestamps: true, versionKey: false }
)


export const Admin = model<IAdmin>('Admin', adminSchema)