import { IApiOperationArgsBase } from 'swagger-express-ts/i-api-operation-args.base'
import { IApiPathArgs } from 'swagger-express-ts/api-path.decorator'

export const path: IApiPathArgs = {
	path: "/api/developers",
	name: "Developers",
}

export const getDevelopers: IApiOperationArgsBase = {
	summary: "Get full list of developers (used by developers management dashboard and contracts management dashboard)",
	path: '/',
	parameters: {
	},
	responses: {
		200: {
			description: 'Success',
			type: 'array', model: 'DeveloperDto'
		},
	},
}

export const getDeveloperById: IApiOperationArgsBase = {
	summary: "Get developer by id (used by contracts management dashboard)",
	path: '/{id}',
	parameters: {
		path: { id: { required: true, name: 'id', description: 'Developer id' } },
	},
	responses: {
		200: {
			description: 'Success',
			model: 'DeveloperDto',
		},
	},
}
