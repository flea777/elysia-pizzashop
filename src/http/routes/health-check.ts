import Elysia, { t } from 'elysia'
import { HealthCheckDtoSchema } from '../dtos/health-check.dto'

export const healthCheck = new Elysia().get(
  '/hello',
  ({ set }) => {
    set.status = 200

    return {
      status: 'ok',
      message: 'Server is up and running!',
      timestamp: Date.now(),
    }
  },
  {
    response: {
      200: HealthCheckDtoSchema,
    },
    detail: {
      summary: 'Endpoint de Health Check',
      description:
        'Retorna o status do servidor. Usado para verificar se a aplicação está online e respondendo',
      tags: ['Monitoring']
    },
  }
)
