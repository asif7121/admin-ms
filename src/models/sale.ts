import { Document, model, Schema } from "mongoose";



interface ISaleItems extends Document {
	productId: Schema.Types.ObjectId
	productName: string
	productMrp: number
	productPrice: number
}

interface ISale extends Document{
    name: string
    description: string
    products?: [ISaleItems]
    saleDiscount: number
    isActive: boolean
    isDeleted: boolean
    startDate: Date
    endDate: Date
    _category: Schema.Types.ObjectId
    _createdBy: Schema.Types.ObjectId
}
const saleItemSchema = new Schema<ISaleItems>({
	productId: { type: Schema.Types.ObjectId, required:true},
	productName: { type: String, required: true },
	productMrp: { type: Number, required: true },
	productPrice: { type: Number, required: true },
}, { _id: false })


const saleSchema = new Schema<ISale>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		_category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		products: [saleItemSchema],
		saleDiscount: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		_createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required:true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)


export const Sale = model<ISale>('Sale', saleSchema)