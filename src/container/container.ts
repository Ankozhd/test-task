import { Container } from 'inversify'
import _ from 'lodash'

import { DevelopersService } from '../domain/developers/services/developers.service'
import { DevelopersRepository } from '../domain/developers/repositories/developers.repository'

// REST API Controllers
import '../rest/controllers/developers.controller'

// Swagger Dto
import '../rest/dto/developers.responses.dto'

export const createContainer = (options: ICreateContainerOptions = {}) => {

	let container = new Container()

	// Services
	container.bind<DevelopersService>('DevelopersService').to(DevelopersService)

	// Repositories
	container.bind<DevelopersRepository>('DevelopersRepository').to(DevelopersRepository)

	for( const serviceIdentifier of ( _.keys(options.overrides) ) ){
		if( container.isBound(serviceIdentifier) ){
			container.unbind(serviceIdentifier)
		}

		if(options.overrides[serviceIdentifier].toConstantValue){
			container.bind(serviceIdentifier).toConstantValue(options.overrides[serviceIdentifier].toConstantValue)
		}

		if(options.overrides[serviceIdentifier].to){
			container.bind(serviceIdentifier).to(options.overrides[serviceIdentifier].to)
		}

	}

	const mergedContainer = options.mergeContainer
		? Container.merge(container, options.mergeContainer)
		: container


	if( options.applicableMiddleware?.apply ){
		options.applicableMiddleware.apply(mergedContainer)
	}


	return mergedContainer

}

export const createContainerWithOverrides = (overrides: IContainerOverrides) => createContainer({ overrides })

export type BindingType = 'to' | 'toConstantValue'
export interface IContainerOverrides {
	[key: string]: { [key in BindingType]? : any }
}

export interface ICreateContainerOptions {
	mergeContainer?: Container,
	overrides? : IContainerOverrides,
	applicableMiddleware?: { apply: any }
}

