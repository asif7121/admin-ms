import { Bundle } from '@models/bundle'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const deleteBundle = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { bundleId } = req.query
		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle Id.' })
		}
		const bundle = await Bundle.findOne({ _id: bundleId, _createdBy: _id })
		if (!bundle) {
			return res.status(404).json({ error: 'bundle not found..' })
        }
        if (bundle.isBlocked) {
			return res.status(400).json({
				error: 'This bundle has been blocked.',
			})
		}
        if (bundle.isDeleted) {
			return res.status(400).json({
				error: 'This bundle already has been deleted by the owner.',
			})
		}
		bundle.isDeleted = true
		await bundle.save()
		return res.status(200).json({ message: 'Bundle deleted successfully', deletedItem: bundle })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
