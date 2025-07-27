import { inject, injectable } from 'inversify';
import { DevelopersRepository } from '../repositories/developers.repository';
import { IDeveloper } from '../types'

@injectable()
export class DevelopersService {

	constructor(
		@inject('DevelopersRepository') private developersRepository: DevelopersRepository,
	) {}

	private async calculateCompletedContractsRevenue(developerId: string): Promise<number> {
		const completedContracts = await this.developersRepository.getCompletedContractsByDeveloperId(developerId)
		return completedContracts.reduce((acc, contract) => acc + contract.amount, 0)
	}

	async getDevelopers(): Promise<IDeveloper[]>{
		const developers = await this.developersRepository.getDevelopers()

		return await Promise.all(
			developers.map(async (developer) => {
				const completedContractsRevenue = await this.calculateCompletedContractsRevenue(developer.id)
				return {
					...developer,
					completedContractsRevenue
				}
			})
		)
	}

	async getDeveloperById(id: string){
		const developer = await this.developersRepository.getDeveloperById(id)
		if (!developer) return null

		const completedContractsRevenue = await this.calculateCompletedContractsRevenue(developer.id)
		return {
			...developer,
			completedContractsRevenue
		}
	}

}
