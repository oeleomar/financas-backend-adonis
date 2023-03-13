import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import FriendLoan from 'App/Models/FriendLoan'

export default class FriendLoansController {
  public async store({ request, response, params }: HttpContextContract) {
    const loanSchema = schema.create({
      description: schema.string(),
      date: schema.date({ format: 'dd-MM-yyyy' }),
      value: schema.number(),
      beReturned: schema.boolean(),
      returnedDay: schema.date.nullableAndOptional({ format: 'dd-MM-yyyy' }),
    })

    try {
      await request.validate({ schema: loanSchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    const body = request.body()
    body.friendId = params.friendId

    try {
      const loan = await FriendLoan.create(body)

      return {
        message: 'Conta criada com sucesso',
        data: loan,
      }
    } catch (err) {
      return response.badRequest({ message: 'Não foi possivel criar a conta' })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const loan = await FriendLoan.findOrFail(params.id)
      return {
        message: 'Sucesso',
        data: loan,
      }
    } catch (err) {
      return response.badRequest({ message: 'Não foi possivel carregar a conta.' })
    }
  }
}
