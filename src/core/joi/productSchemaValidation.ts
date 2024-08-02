import Joi from 'joi'

export const productValidationSchema = Joi.object({
	name: Joi.string().required().messages({
		'any.required': 'Name is required',
		'string.empty': 'Name cannot be empty',
	}),
	description: Joi.string().required().messages({
		'any.required': 'Description is required',
		'string.empty': 'Description cannot be empty',
	}),
	mrp: Joi.number().required().messages({
		'any.required': 'MRP is required',
		'number.base': 'MRP must be a number',
	}),
	discount: Joi.number().optional().messages({
		'number.base': 'Discount must be a number',
	}),
	stockAvailable: Joi.number().required().default(0).messages({
		'any.required': 'Stock available is required',
		'number.base': 'Stock available must be a number',
	}),
	_category: Joi.string().required().messages({
		'any.required': 'Category is required',
		'string.empty': 'Category cannot be empty',
	}),
})
