import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import { IDeveloper } from '../../domain/developers/types'

@ApiModel()
export class DeveloperDto implements IDeveloper {

	@ApiModelProperty()
	id: string

	@ApiModelProperty()
	firstName?: string

	@ApiModelProperty()
	lastName?: string

	@ApiModelProperty()
	email: string


}
