import { Document, model, Schema } from "mongoose";




interface IDiscount extends Document {
	type: 'mrp' | 'price'
	value: number
	startDate: Date
	endDate: Date
	isDeleted: boolean
	_products?: Schema.Types.ObjectId[]
	_bundles?: Schema.Types.ObjectId[]
	_createdBy: Schema.Types.ObjectId
}

const schema: Schema = new Schema(
	{
		value: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ['mrp', 'price'],
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		_products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
				default: undefined,
			},
		],
		_bundles: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Bundle',
				default: undefined,
			},
		],
		_createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
)


export const Discount = model<IDiscount>('Discount', schema)