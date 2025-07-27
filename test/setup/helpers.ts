import { Application } from '../../src/Application'
import { createContainer, IContainerOverrides } from '../../src/container/container'
import { Container } from 'inversify'
import { SuperAgent } from 'superagent'
import supertest from 'supertest'

export const createRequest = async (options: ICreateRequestOptions = {}): Promise<SuperAgent<any>> => {

	const container =
		options?.container || createContainer({
			overrides: options.containerOverrides,
		})

	const application = new Application({ container })
	await application.init()
	return getSupertestInstance(application.getExpressApp())

}

export const createRequestWithContainerOverrides = async (containerOverrides: IContainerOverrides) => {
	return createRequest({ containerOverrides })
}

export interface ICreateRequestOptions {
	containerOverrides?: IContainerOverrides,
	containerApplicableMiddleware?: { apply: any }
	container?: Container,
}

export const getSupertestInstance = (app) => {
	return supertest.agent(app)
}

