import 'reflect-metadata'
import express from 'express'
import bodyParser from 'body-parser'
import { InversifyExpressServer } from 'inversify-express-utils'
import { createContainer } from './container/container'
import * as swagger from 'swagger-express-ts'
import { generalDoc } from './rest/swagger/general.docs'
import { engine } from 'express-handlebars';
import path from 'node:path'
import { Express } from 'express-serve-static-core'
import { Container, interfaces } from 'inversify'

export class Application {

	private expressApp: Express
	private inversifyServer: InversifyExpressServer
	private container: Container | interfaces.Container

	constructor(options: IApplicationOptions = {}) {
		this.container = options.container || null
	}

	public async init(){
		this.initContainer()
		this.initExpressApp()
	}

	private initContainer(){
		if( !this.container ){
			this.container = createContainer()
		}
	}

	private initExpressApp(){
		const app = express()
		app.all('*', (req, _res, next) => {
			//@ts-ignore
			req.container = this.container
			next()
		})

		app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
		app.use(bodyParser.json({ limit: '50mb' }))
		app.engine('handlebars', engine());
		app.set('view engine', 'handlebars');
		app.set('views', path.resolve(__dirname + '/views'));

		this.inversifyServer = new InversifyExpressServer(this.container, null, null, app)

		this.inversifyServer
			.setConfig(app => {
				app.use('/api-docs/swagger', express.static('swagger'))
				app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'))
				app.use(swagger.express(
					{ definition: generalDoc }
				))
				app.get('/api-docs/swagger', (_req, res) => {
					res.render('swagger')
				})
			})
			.setErrorConfig(app => {

				app.use((e, _req, res, _next) => {

					res.status(e.statusCode || 500).json({
						error: {
							name: e.name || 'Internal server error',
							message: e.message,
							stack: e.stack,
							payload: e.payload,
							code: e.code,
						}
					})
				})
			})
			.build()

		app.get('*', (_req, res) => {
			res.render('404')
		})

		this.expressApp = app

	}

	public listen(...args){
		this.expressApp.listen(...args)
	}

	public getExpressApp(){
		return this.expressApp
	}

	public getContainer(){
		return this.container
	}

}

export interface IApplicationOptions {
	container?: any
}

