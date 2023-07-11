import { compare, hash } from 'bcrypt'

const rounds = 10

export async function getEncryptedPassword(rawPassword: string) {
	const encryptedPassword: string = await hash(rawPassword, rounds)
	return encryptedPassword
}

export async function comparePassword(rawPassword: string, encryptedPassword: string) {
	const result: boolean = await compare(rawPassword, encryptedPassword)
	return result
}
