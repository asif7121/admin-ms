import { Document, model, Schema } from "mongoose";




interface IDiscount extends Document {
	value: number
	name: string
	startDate: Date
	endDate: Date
	isDeleted: boolean
	_product?: Schema.Types.ObjectId
	_bundle?: Schema.Types.ObjectId
	_createdBy: Schema.Types.ObjectId
}

const schema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true
		},
		value: {
			type: Number,
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
			default: false
		},
		_product: {
            type: Schema.Types.ObjectId,
            default: undefined
		},
		_bundle: {
            type: Schema.Types.ObjectId,
            default: undefined
		},
		_createdBy: {
            type: Schema.Types.ObjectId,
            default: undefined
		},
	},
	{ timestamps: true, versionKey: false }
)


export const AdminDiscount = model<IDiscount>('AdminDiscount', schema)