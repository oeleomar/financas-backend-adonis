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
      response.status(201)

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
      return response.notFound({ message: 'Não foi possivel encontrar a conta.' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const loan = await FriendLoan.findOrFail(params.id)
      await loan.delete()

      response.status(202)

      return {
        message: 'Apagado com sucesso',
        data: loan,
      }
    } catch (err) {
      return response.notFound({ message: 'Não foi possivel encontrar a conta.' })
    }
  }

  public async update({ params, response, request }: HttpContextContract) {
    const body = request.body()

    if (Object.keys(body).length === 0)
      return response.badRequest({ message: 'Nada para atualizar' })

    try {
      const loan = await FriendLoan.findOrFail(params.id)

      if (body.description) loan.description = body.description
      if (body.date) loan.date = body.date
      if (body.value) loan.value = body.value
      if (body.beReturned) loan.beReturned = body.beReturned
      if (body.returnedDay) loan.returnedDay = body.returnedDay
      response.status(200)
      loan.save()

      return {
        message: 'Atualizado com sucesso',
        data: loan,
      }
    } catch (err) {
      return response.badRequest(err)
    }
  }
}
