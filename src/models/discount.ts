import { Document, model, Schema } from "mongoose";




interface IDiscount extends Document {
	value: number
	discountCode: string
	startDate: Date
	endDate: Date
	isDeleted: boolean
	_product?: Schema.Types.ObjectId[]
	_bundle?: Schema.Types.ObjectId[]
	_createdBy: Schema.Types.ObjectId
}

const schema: Schema = new Schema(
	{
		value: {
			type: Number,
			required: true,
		},
		discountCode: {
			type: String,
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
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product',
				default: undefined,
			},
		],
		bundles: [
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