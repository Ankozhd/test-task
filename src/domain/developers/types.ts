export interface IDeveloper {
	id: string
	firstName?: string
	lastName?: string
	email: string
	completedContractsRevenue?: number
}

export interface IContract {
	id: number
	developerId: string
	status: 'pending' | 'completed' | 'ongoing'
	amount: number
}
