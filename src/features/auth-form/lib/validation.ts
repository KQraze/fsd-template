import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const loginSchemaRaw = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export const loginSchema = toTypedSchema(loginSchemaRaw)

export type LoginFormValues = z.infer<typeof loginSchemaRaw>