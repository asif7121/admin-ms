import { Document, model, Schema } from 'mongoose'

interface IBundle extends Document {
	name: string
	price: number
	discount?: number
	isDeleted: boolean
	isBlocked: boolean
	_blockedBy: Schema.Types.ObjectId
	_products: Schema.Types.ObjectId[]
	_createdBy: {
		_id: Schema.Types.ObjectId
		role: 'seller' | 'admin'
	}
}

const bundleSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		_products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		discount: {
			type: Number,
			default: undefined,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		_blockedBy: {
			type: Schema.Types.ObjectId,
			default: undefined,
		},

		_createdBy: {
			_id: {
				type: Schema.Types.ObjectId,
			},
			role: {
				type: String,
				enum: ['seller', 'admin'],
			},
		},
	},
	{ timestamps: true, versionKey: false }
)

export const Bundle = model<IBundle>('Bundle', bundleSchema)
