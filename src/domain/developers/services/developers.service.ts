import { inject, injectable } from 'inversify';
import { DevelopersRepository } from '../repositories/developers.repository';
import { IDeveloper } from '../types'

@injectable()
export class DevelopersService {

	constructor(
		@inject('DevelopersRepository') private developersRepository: DevelopersRepository,
	) {}

	async getDevelopers(): Promise<IDeveloper[]>{
		return this.developersRepository.getDevelopers()
	}

	async getDeveloperById(id: string){
		return this.developersRepository.getDeveloperById(id)
	}

}
