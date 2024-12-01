/**
 * E2E testing
 * Purpose: to unit test the Register auth and Login routes
 */

import request from 'supertest'
import { expect } from 'chai'
import app from '../../src/app.js'
import Employee from '../../src/models/employee.js'

describe('API Endpoints', () => {
	let testUser
	let authToken

	before(async () => {
		await Employee.destroy({ where: {} })

		const userData = {
			name: 'Test User',
			positionId: 1,
			positionName: 'Manager',
			parentId: null,
		}

		const registerResponse = await request(app).post('/auth/register').send(userData)

		testUser = registerResponse.body
		expect(registerResponse.status).to.equal(201)
		expect(testUser).to.have.property('token')
	})

	after(async () => {
		await Employee.destroy({ where: {} })
	})

	describe('Auth Routes', () => {
		it('should login successfully with valid credentials', async () => {
			const loginResponse = await request(app).post('/auth/login').send({
				id: testUser.id,
				name: testUser.name,
			})

			expect(loginResponse.status).to.equal(200)
			expect(loginResponse.body).to.have.property('token')
			authToken = loginResponse.body.token
		})

		it('should fail login with invalid credentials', async () => {
			const response = await request(app).post('/auth/login').send({
				id: 999,
				name: 'Invalid User',
			})

			expect(response.status).to.equal(401)
			expect(response.body.message).to.equal('Invalid credentials')
		})
	})

	describe('Registration Validation', () => {
		it('should validate required fields during registration', async () => {
			const response = await request(app).post('/auth/register').send({})

			expect(response.status).to.equal(400)
			expect(response.body).to.have.property('error')
		})
	})
})
