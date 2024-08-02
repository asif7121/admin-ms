import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const unblockBundle = async (req: Request, res: Response) => {
	try {
		
		const { bundleId } = req.query
		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid Bundle Id.' })
		}
		const bundle = await Bundle.findOne({ _id: bundleId })
		if (!bundle) {
			return res.status(404).json({ error: 'bundle not found..' })
		}
		if (bundle.isDeleted) {
			return res.status(400).json({
				error: 'This bundle has been deleted by the owner.',
			})
		}
		if (!bundle.isBlocked) {
			return res.status(400).json({
				error: 'This bundle already has been unblocked.',
			})
		}
		bundle.isBlocked = false
		bundle._blockedBy = undefined
		await bundle.save()
		return res.status(200).json({ message: 'Bundle unblocked successfully', unblockedItem: bundle })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
