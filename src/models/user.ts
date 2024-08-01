import { Document, Schema, model } from 'mongoose'

export interface IAuth extends Document {
	username: string
	password: string
	email: string
	phone: string
	countryCode: string
	isEmailVerified: boolean
	isPhoneVerified: boolean
	isVerified: boolean
	isBlocked: boolean
	isActive: boolean
	secret?: string
	authMethod: 'email' | 'phone' | 'authenticator'
	isTwoFAEnabled?: boolean
	resetPasswordToken?: string
	address?: [object]
	role: 'user' | 'seller'
	dob: Date
	tempEmail?: string
	tempPhone?: string
	tempCountryCode?: string
}

const AuthSchema: Schema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		countryCode: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		isPhoneVerified: {
			type: Boolean,
			default: false,
		},

		secret: {
			type: String,
		},
		authMethod: {
			type: String,
			enum: ['email', 'phone', 'authenticator'],
			default: 'email',
		},
		isTwoFAEnabled: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
			type: String,
			default: undefined,
		},
		address: [
			{
				street: {
					type: String,
				},
				area: {
					type: String,
				},
				city: {
					type: String,
				},
				zipcode: {
					type: String,
				},
				state: {
					type: String,
				},
				country: {
					type: String,
				},
			},
		],
		role: {
			type: String,
			enum: ['seller', 'user'],
			default: 'user',
		},
		dob: {
			type: Date,
			required: true,
		},
		tempEmail: { type: String },
		tempPhone: { type: String },
		tempCountryCode: { type: String },
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

export const User = model<IAuth>('User', AuthSchema)
