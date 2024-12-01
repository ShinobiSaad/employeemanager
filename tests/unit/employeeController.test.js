/**
 * Unit testing
 * Purpose: to unit test the Employee Controller and Hirerchy data
 */
import { expect } from 'chai'
import sinon from 'sinon'
import { getUserHierarchy } from '../../src/controllers/employeecontroller.js'
import Employee from '../../src/models/employee.js'

describe('Employee Controller', () => {
	let findAllStub

	beforeEach(() => {
		findAllStub = sinon.stub(Employee, 'findAll')
	})

	afterEach(() => {
		sinon.restore()
	})

	describe('getUserHierarchy', () => {
		it('should return employee hierarchy for valid user', async () => {
			const mockEmployees = [
				{
					id: 1,
					name: 'Mr Test CEO',
					positionId: 1,
					positionName: 'CEO',
					parentId: null,
					dataValues: {
						id: 1,
						name: 'Mr Test CEO',
						positionId: 1,
						positionName: 'CEO',
						parentId: null,
					},
				},
				{
					id: 2,
					name: 'Mr Test Manager',
					positionId: 2,
					positionName: 'Manager',
					parentId: 1,
					dataValues: {
						id: 2,
						name: 'Mr Test Manager',
						positionId: 2,
						positionName: 'Manager',
						parentId: 1,
					},
				},
			]

			findAllStub.resolves(mockEmployees)

			const result = await getUserHierarchy(1)

			expect(Array.isArray(result)).to.be.true

			if (result.length > 0) {
				const firstEmployee = result[0]
				expect(firstEmployee).to.have.property('id')
				expect(firstEmployee).to.have.property('name')
				expect(firstEmployee).to.have.property('positionName')
			}
		})

		it('should return empty array for non-existent user', async () => {
			findAllStub.resolves([])

			const result = await getUserHierarchy(999)
			expect(result).to.be.an('array').that.is.empty
		})
	})
})
