import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'

export default class FriendsController {
  public friendSchema = schema.create({
    name: schema.string(),
  })

  public async store({ request, response, params }: HttpContextContract) {
    try {
      await request.validate({ schema: this.friendSchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    await User.findOrFail(params.id)
    const body = request.body()
    body.userId = params.id

    try {
      const friend = await Friend.create(body)

      return {
        message: 'Amigo adicionado com sucesso',
        data: friend,
      }
    } catch (err) {
      return response.internalServerError({ message: 'Não foi possivel criar a informação' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const friend = await Friend.findOrFail(params.id)

      await friend.delete()

      return {
        message: 'Amigo deletado',
        data: friend,
      }
    } catch (err) {
      return response.notFound({ message: 'Não foi possivel deletar o dado' })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({ schema: this.friendSchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    const friend = await Friend.findOrFail(params.id)
    const body = request.body()
    friend.name = body.name

    return {
      message: 'Atualizado com sucesso',
      data: friend,
    }
  }
}
