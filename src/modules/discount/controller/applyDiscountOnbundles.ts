import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'
import moment from 'moment'
import _ from 'lodash'
import { Discount } from '@models/discount'
import { isValidObjectId } from 'mongoose'

export const applyDiscountToBundles = async (req: Request, res: Response) => {
	try {
		const { discountId, bundleIds } = req.body

		if (!isValidObjectId(discountId)) {
			return res.status(400).json({ error: 'Invalid discount ID.' })
		}
		// Validate that bundlesId is an array of valid ObjectId strings
		if (!Array.isArray(bundleIds) || bundleIds.some((id) => !isValidObjectId(id))) {
			return res.status(400).json({ error: 'Invalid bundle IDs.' })
		}
		const discount = await Discount.findById(discountId)

		if (!discount) {
			return res.status(404).json({ error: 'Discount not found' })
		}
		if (discount.isDeleted) {
			return res.status(400).json({ error: 'This discount already has been deleted.' })
		}

		// Check if the discount is expired
		const currentDate = moment()
		if (currentDate.isBefore(discount.startDate) || currentDate.isAfter(discount.endDate)) {
			return res.status(400).json({ error: 'Discount is expired or not yet active' })
		}

		const uniqueBundleIds = _.uniq(bundleIds)
		// Filter out product IDs that are already associated with this discount
		const newBundleIds = uniqueBundleIds.filter(
			(id) => !discount._bundles.toString().includes(id)
		)

		if (newBundleIds.length === 0) {
			return res
				.status(400)
				.json({ error: 'All provided bundles already have this discount.' })
		}
		const bundles = await Bundle.find({
			_id: { $in: newBundleIds },
			isDeleted: false,
			isBlocked: false,
		})

		if (bundles.length !== newBundleIds.length) {
			return res.status(404).json({ error: 'Some bundles not found or are not available' })
		}
		for (const bundle of bundles) {
			if (bundle.platformDiscount !== undefined) {
				return res
					.status(400)
					.json({
						error: `This bundle ${bundle._id} already had a discount applied by admin`,
					})
			}
		}
		if (discount.type === 'price') {
			// Use aggregation pipeline to update bundles
			await Bundle.updateMany(
				{ _id: { $in: newBundleIds }, isDeleted: false, isBlocked: false },
				[
					{ $set: { platformDiscount: discount.value } },
					{
						$set: {
							price: {
								$subtract: [
									'$price',
									{ $multiply: ['$price', discount.value / 100] },
								],
							},
						},
					},
				]
			)
		} else if (discount.type === 'mrp') {
			// Use aggregation pipeline to update bundles
			await Bundle.updateMany(
				{ _id: { $in: newBundleIds }, isDeleted: false, isBlocked: false },
				[
					{ $set: { platformDiscount: discount.value } },
					{
						$set: {
							price: {
								$subtract: ['$mrp', { $multiply: ['$mrp', discount.value / 100] }],
							},
						},
					},
				]
			)
		}

		discount._bundles = [...discount._bundles, ...newBundleIds]
		await discount.save()

		return res.status(200).json({ success: true, data: discount })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
