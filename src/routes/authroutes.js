import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import jwt from 'jsonwebtoken'
import Employee from '../models/employee.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'key'

router.post('/register', async (req, res) => {
	try {
		const { name, positionId, positionName, parentId } = req.body
		const user = await Employee.create({
			name,
			positionId,
			positionName,
			parentId,
		})

		const token = jwt.sign({ id: user.id }, JWT_SECRET, {
			expiresIn: '1h',
		})

		res.status(201).json({
			id: user.id,
			name: user.name,
			token,
		})
	} catch (error) {
		res.status(400).json({
			error: error.message,
			details: error.errors?.map((e) => ({
				message: e.message,
				field: e.path,
				value: e.value,
			})),
		})
	}
})

router.post('/login', async (req, res) => {
	const { id, name } = req.body
	const user = await Employee.findOne({ where: { id, name } })

	if (user) {
		const token = jwt.sign({ id: user.id }, JWT_SECRET, {
			expiresIn: '1h',
		})
		return res.json({ token })
	}

	return res.status(401).json({ message: 'Invalid credentials' })
})

export const verifyToken = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')[1]
	if (!token) return res.status(403).send('Auth token required')

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) return res.status(401).send('Invalid Token')
		req.user = decoded
		next()
	})
}

export default router
