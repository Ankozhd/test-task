import { ISwaggerBuildDefinition } from 'swagger-express-ts/swagger.builder';

export const generalDoc: ISwaggerBuildDefinition = {
	info: {
		title: "Lemon API",
		version: `1.0.0`,
	},
	securityDefinitions: {
	},
	schemes: ['http']
}
