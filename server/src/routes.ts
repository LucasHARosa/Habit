import dayjs from "dayjs"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {

  // Criação de habito a partir do usuário
  // Passamos a informação por meio de um JSON no body
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            }
          }),
        }
      }
    })
  })

  // Obtemos duas informações nessa rota: habitos do dia e habitos completos no dia
  // Pegamos as informações por meio de query na rota do endereço
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      },
    })

    const day = await prisma.day.findFirst({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    }) ??[]

    return {
      possibleHabits,
      completedHabits,
    }
  })

  // Mudamos o status de algo já existente, no caso o habito
  // Se essa rota for acionada iremos tirar a marcação de completo ou colocar a marcação de completo. Isso significa retirar ou colocar um item na tabela "Day"
  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })

    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    if(!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })

    if(dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }
  })

  // Pegamos as informações de dos dias para determinar a cor do quadrado na relação: habitos completos e habitos a completar
  // Puxamos a informação por meio de SQLite
  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, D.date,
        (
          SELECT cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `

    return summary
  })

}

