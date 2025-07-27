// **************************************************************************
// Репозиторій імітує шар підключення до бази данних. Данні знаходяться в data.ts
// **************************************************************************

import { injectable } from 'inversify';
import { IContract, IDeveloper } from '../types'
import { contracts, developers } from './data'

@injectable()
export class DevelopersRepository {

	async getDevelopers(): Promise<IDeveloper[]>{
		return developers
	}

	async getDeveloperById(id: string): Promise<IDeveloper>{
		return developers.find(d => d.id === id)
	}

	async getContracts(): Promise<IContract[]> {
		return contracts
	}

	async getContractsByDeveloperId(developerId: string): Promise<IContract[]> {
		return contracts.filter(contract => contract.developerId === developerId)
	}

	async getCompletedContractsByDeveloperId(developerId: string): Promise<IContract[]> {
		return contracts.filter(contract => contract.developerId === developerId && contract.status === 'completed')
	}
}
