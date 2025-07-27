
import 'reflect-metadata'
import { request } from './setup/shortcuts'
import { createRequestWithContainerOverrides } from './setup/helpers'
import { DevelopersRepository } from '../src/domain/developers/repositories/developers.repository'
import { IContract } from '../src/domain/developers/types'

describe('Developers API tests', () => {

	it('should BAT fetch developers (e2e, real repository used)', async () => {

		const result = await request.get(`/api/developers`)

		expect(result.status).toBe(200)
		expect(result.body?.length).toBeGreaterThan(0)

		for( const developer of result.body ){
			expect(developer).toHaveProperty('id')
			expect(developer).toHaveProperty('firstName')
			expect(developer).toHaveProperty('lastName')
			expect(developer).toHaveProperty('email')
			expect(developer).toHaveProperty('completedContractsRevenue')
			expect(typeof developer.completedContractsRevenue).toBe('number')
		}

	})

	it('should BAT get developer by id (mocked repository used)', async () => {

		const req = await createRequestWithContainerOverrides({
			'DevelopersRepository': {
				toConstantValue: {
					getDeveloperById: async (_id: string) => ({
						"id": "65de346c255f31cb84bd10e9",
						"email": "Brandon30@hotmail.com",
						"firstName": "Brandon",
						"lastName": "D'Amore"
					}),
					getCompletedContractsByDeveloperId: async (_id: string): Promise<IContract[]> => ([
						{ id: 1, developerId: "65de346c255f31cb84bd10e9", status: 'completed', amount: 5000 },
						{ id: 2, developerId: "65de346c255f31cb84bd10e9", status: 'completed', amount: 3000 }
					])
				} as Partial<DevelopersRepository>
			}
		})

		const result = await req.get(`/api/developers/65de346c255f31cb84bd10e9`)

		expect(result.status).toBe(200)

		const developer = result.body
		expect(developer).toHaveProperty('id')
		expect(developer).toHaveProperty('firstName')
		expect(developer).toHaveProperty('lastName')
		expect(developer).toHaveProperty('email')
		expect(developer).toHaveProperty('completedContractsRevenue')
		expect(developer.completedContractsRevenue).toBe(8000)

	})

	it('should return developer with zero revenue when no completed contracts exist', async () => {

		const req = await createRequestWithContainerOverrides({
			'DevelopersRepository': {
				toConstantValue: {
					getDeveloperById: async (_id: string) => ({
						"id": "test-developer-id",
						"email": "test@example.com",
						"firstName": "Test",
						"lastName": "Developer"
					}),
					getCompletedContractsByDeveloperId: async (_id: string): Promise<IContract[]> => ([])
				} as Partial<DevelopersRepository>
			}
		})

		const result = await req.get(`/api/developers/test-developer-id`)

		expect(result.status).toBe(200)
		expect(result.body.completedContractsRevenue).toBe(0)

	})

	it('should return all developers with calculated revenue (e2e test)', async () => {

		const result = await request.get(`/api/developers`)

		expect(result.status).toBe(200)
		expect(Array.isArray(result.body)).toBe(true)

		const katheryn = result.body.find((dev: any) => dev.id === '65de346a255f31cb84bd0e01')
		const brandon = result.body.find((dev: any) => dev.id === '65de346c255f31cb84bd10e9')

		expect(katheryn).toBeDefined()
		expect(katheryn.completedContractsRevenue).toBe(11000)

		expect(brandon).toBeDefined()
		expect(brandon.completedContractsRevenue).toBe(12000)

	})

})
