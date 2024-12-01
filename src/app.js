import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import sequelize from './config/database.js'
import authRoutes from './routes/authroutes.js'
import hierarchyRoutes from './routes/employeeroutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(compression())

/**
 * The following limiter just limits every ip to 100 request in every  minute
 */
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 100,
})
app.use(limiter)

/**
 * Payload size configuration
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/auth', authRoutes)
app.use('/api', hierarchyRoutes)

// Database connection
async function initializeDatabase() {
	try {
		await sequelize.authenticate()
		console.log('Database connected successfully.')
		await sequelize.sync()
	} catch (error) {
		console.error('Unable to connect to the database:', error)
		process.exit(1)
	}
}

// Server
async function startServer() {
	await initializeDatabase()

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
}

startServer()

export default app
