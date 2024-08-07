import { Schema, Document, model } from 'mongoose'

interface IProduct extends Document {
	name: string
	price: number
	mrp: number
	discount?: number
	stockAvailable: number
	description: string
	isDeleted: boolean
	isBlocked: boolean
	platformDiscount?: number
	discountedPrice?: number
	_blockedBy?: Schema.Types.ObjectId
	_category: Schema.Types.ObjectId
	_createdBy: {
		_id: Schema.Types.ObjectId
		role: 'seller' | 'admin'
	}
}

const productSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
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
		discount: {
			type: Number,
			default: undefined,
		},
		platformDiscount: {
			type: Number,
			default: undefined,
		},
		discountedPrice: {
			type: Number,
			default: undefined,
		},
		stockAvailable: {
			type: Number,
			required: true,
			default: 0,
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
				required: true,
			},
			role: {
				type: String,
				enum: ['seller', 'admin'],
				required: true,
			},
		},
		_category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

export const Product = model<IProduct>('Product', productSchema)
