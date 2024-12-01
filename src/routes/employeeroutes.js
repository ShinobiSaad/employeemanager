import express from 'express'
import { getUserHierarchy } from '../controllers/employeecontroller.js'
import logger from '../utils/logger.js'

const router = express.Router()

router.get('/hierarchy/:id', async (req, res) => {
	try {
		const userId = parseInt(req.params.id)
		const hierarchy = await getUserHierarchy(userId)
		res.json(hierarchy)
	} catch (error) {
		logger.error('Failed to retrieve hierarchy', {
			userId: req.params.id,
			error: error.message,
			stack: error.stack,
		})
		res.status(500).json({
			error: 'Failed to retrieve hierarchy',
			details: error.message,
		})
	}
})

export default router
