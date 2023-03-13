import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    const data = await User.query()
    return {
      message: 'Sucesso',
      data,
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      name: schema.string(),
      lastName: schema.string(),
      email: schema.string({}, [rules.email()]),
      password: schema.string(),
      confirmPassword: schema.string(),
      netSalary: schema.number.nullableAndOptional(),
      agreeRules: schema.boolean(),
    })

    try {
      await request.validate({ schema: userSchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    const body = request.body()
    if (body.password !== body.confirmPassword)
      return response.badRequest({ message: 'As senhas são diferentes' })
    if (!body.agreeRules)
      return response.badRequest({ message: 'Necessário concordar com as regras' })

    try {
      const user = await User.create({
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        passwordHash: body.password,
        net_salary: body.netSalary,
        agree_rules: body.agreeRules,
      })

      return {
        message: 'Usuário criado com sucesso',
        data: user,
      }
    } catch (err) {
      return response.badRequest({ message: 'Usuário já existente.' })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const data = await User.findOrFail(params.id)
      await data.load('friends', async (query) => {
        await query.preload('friendLoans')
      })

      return {
        message: 'Sucesso',
        data,
      }
    } catch (err) {
      return response.notFound({ message: 'Não foi possível buscar os dados' })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const body = request.body()
    const user = await User.findOrFail(params.id)

    if (Object.keys(body).length === 0) return { message: 'Nada á atualizar' }

    if (body.name) user.name = body.name
    if (body.lastName) user.lastName = body.lastName
    if (body.email) user.email = body.email
    if (body.netSalary) user.net_salary = body.netSalary
    if (body.password && body.password === body.confirmPassword) user.passwordHash = body.password
    if (body.password && body.password !== body.confirmPassword)
      return response.unprocessableEntity({ message: 'As senhas não são iguais' })

    user.save()

    return {
      message: 'Atualizado com sucesso',
      data: user,
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      user.delete()

      return {
        message: 'Usuário deletado com sucesso',
      }
    } catch (err) {
      return response.internalServerError({ message: 'Não foi possível apagar' })
    }
  }
}
