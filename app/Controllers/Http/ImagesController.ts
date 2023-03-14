import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuid } from 'uuid'
import Image from 'App/Models/Image'

export default class ImagesController {
  private fileType = {
    size: '2mb',
    extnames: ['svg'],
  }

  public async index({ response }: HttpContextContract) {
    try {
      const images = await Image.all()

      return {
        message: 'Sucesso',
        data: images,
      }
    } catch (err) {
      return response.internalServerError({ message: 'Algo saiu errado' })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const image = request.file('image', this.fileType)

    if (!image) return response.badRequest('Imagem não enviada')

    if (!image.isValid) {
      return response.badRequest({ message: 'Imagem inválida' })
    }

    await image.move(Application.tmpPath('uploads'), {
      name: `${uuid()}.${image.extname}`,
      overwrite: true,
    })

    const body = request.body()
    body.fileName = image.fileName

    try {
      const image = await Image.create(body)
      return {
        message: 'Imagem criado com sucesso',
        data: image,
      }
    } catch (err) {
      return response.badRequest({ message: 'Não foi possivel enviar a imagem' })
    }
  }
}
