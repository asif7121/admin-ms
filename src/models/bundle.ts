import { Document, model, Schema } from 'mongoose'

interface IBundle extends Document {
	name: string
	price: number
	mrp: number
	discount?: number
	isDeleted: boolean
	isBlocked: boolean
	platformDiscount?: number
	_blockedBy: Schema.Types.ObjectId
	_products: Schema.Types.ObjectId[]
	_createdBy: Schema.Types.ObjectId
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
		mrp: {
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
		platformDiscount: {
			type: Number,
			default: undefined,
		},
		_blockedBy: {
			type: Schema.Types.ObjectId,
			default: undefined,
		},

		_createdBy: {
			type: Schema.Types.ObjectId,
			required:true
		},
	},
	{ timestamps: true, versionKey: false }
)

export const Bundle = model<IBundle>('Bundle', bundleSchema)
