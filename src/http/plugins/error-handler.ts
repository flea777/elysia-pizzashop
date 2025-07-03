import Elysia from 'elysia'

export const errorHandler = new Elysia().onError(({ error, code, set }) => {
  switch (code) {
    case 'VALIDATION': {
      set.status = 422

      return { code, message: error.message }
    }

    default: {
      set.status = 500
      return new Response(null, { status: 500 })
    }
  }
})
