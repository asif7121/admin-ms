import { Schema, Document, model } from 'mongoose'

interface ISeller extends Document {
	_seller: Schema.Types.ObjectId
	shopName: string
	shopDescription?: string
	shopContactNumber: string
	businessLicense: string
    taxId: string
    gstNumber: string
	website?: string
}

const sellerSchema: Schema = new Schema(
	{
		_seller: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			unique: true,
		},
        shopName: {
            type: String,
            required: true
        },
        shopDescription: {
            type: String
        },
        shopContactNumber: {
            type: String,
            required: true
        },
        businessLicense: {
            type: String,
            required: true
        },
        taxId: {
            type: String,
            required: true
        },
        website: {
            type: String
        },
	},
	{
		timestamps: true,
	}
)

export const SellerInfo = model<ISeller>('SellerInfo', sellerSchema)
