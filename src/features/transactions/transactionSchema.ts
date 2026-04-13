import { z } from 'zod'

export const transactionSchema = z.object({
  title: z.string().min(2, 'Tiêu đề tối thiểu 2 ký tự'),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  note: z.string().optional(),
  walletId: z.string().min(1),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
