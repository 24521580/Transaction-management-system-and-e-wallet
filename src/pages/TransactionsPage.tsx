import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useAppStore } from '../store/useAppStore'
import type { Transaction, TransactionFilters } from '../types'
import { formatCurrency, formatDate } from '../utils/format'
import { transactionSchema, type TransactionFormValues } from '../features/transactions/transactionSchema'
import { transactionService } from '../services/api/transactionService'

const initialFilters: TransactionFilters = {
  query: '',
  type: '',
  category: '',
  minAmount: '',
  maxAmount: '',
  fromDate: '',
  toDate: '',
}

const perPage = 6

export function TransactionsPage() {
  const { transactions, categories } = useAppStore((state) => ({ transactions: state.transactions, categories: state.categories }))
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)
  const [page, setPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const filtered = useMemo(
    () =>
      transactions.filter((item) => {
        const text = `${item.title} ${item.note ?? ''}`.toLowerCase()
        return (
          (!filters.query || text.includes(filters.query.toLowerCase())) &&
          (!filters.type || item.type === filters.type) &&
          (!filters.category || item.category === filters.category) &&
          (!filters.minAmount || item.amount >= Number(filters.minAmount)) &&
          (!filters.maxAmount || item.amount <= Number(filters.maxAmount)) &&
          (!filters.fromDate || new Date(item.date) >= new Date(filters.fromDate)) &&
          (!filters.toDate || new Date(item.date) <= new Date(filters.toDate))
        )
      }),
    [filters, transactions],
  )

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { title: '', amount: 0, type: 'expense', category: '', date: new Date().toISOString().slice(0, 10), note: '', walletId: 'main' },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ title: '', amount: 0, type: 'expense', category: '', date: new Date().toISOString().slice(0, 10), note: '', walletId: 'main' })
    setOpenModal(true)
  }

  const openEdit = (item: Transaction) => {
    setEditing(item)
    reset({ title: item.title, amount: item.amount, type: item.type, category: item.category, date: item.date, note: item.note, walletId: item.walletId })
    setOpenModal(true)
  }

  const columns = [
    { key: 'title', title: 'Tiêu đề' },
    { key: 'category', title: 'Danh mục' },
    { key: 'date', title: 'Ngày', render: (row: Transaction) => formatDate(row.date) },
    {
      key: 'amount',
      title: 'Số tiền',
      render: (row: Transaction) => <span className={row.type === 'expense' ? 'text-danger' : 'text-success'}>{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (row: Transaction) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="h-8 px-3" onClick={() => openEdit(row)}>
            Sửa
          </Button>
          <Button variant="danger" className="h-8 px-3" onClick={() => transactionService.remove(row.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      <Card className="space-y-4" title="Bộ lọc giao dịch">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Tìm kiếm" value={filters.query} onChange={(event) => { setFilters((prev) => ({ ...prev, query: event.target.value })); setPage(1) }} />
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Loại</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" value={filters.type} onChange={(event) => { setFilters((prev) => ({ ...prev, type: event.target.value as TransactionFilters['type'] })); setPage(1) }}>
              <option value="">Tất cả</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Danh mục</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" value={filters.category} onChange={(event) => { setFilters((prev) => ({ ...prev, category: event.target.value })); setPage(1) }}>
              <option value="">Tất cả</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </label>
          <Input label="Từ ngày" type="date" value={filters.fromDate} onChange={(event) => { setFilters((prev) => ({ ...prev, fromDate: event.target.value })); setPage(1) }} />
          <Input label="Đến ngày" type="date" value={filters.toDate} onChange={(event) => { setFilters((prev) => ({ ...prev, toDate: event.target.value })); setPage(1) }} />
          <Input label="Số tiền từ" type="number" value={filters.minAmount} onChange={(event) => { setFilters((prev) => ({ ...prev, minAmount: event.target.value })); setPage(1) }} />
          <Input label="Số tiền đến" type="number" value={filters.maxAmount} onChange={(event) => { setFilters((prev) => ({ ...prev, maxAmount: event.target.value })); setPage(1) }} />
        </div>
      </Card>

      <Card title="Danh sách giao dịch" subtitle="Thêm, sửa, xóa giao dịch cá nhân">
        <div className="mb-4 flex justify-end">
          <Button onClick={openCreate}>+ Thêm giao dịch</Button>
        </div>

        {paginated.length ? (
          <>
            <DataTable columns={columns} rows={paginated} getRowKey={(row) => row.id} />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="secondary" className="h-9 px-3" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</Button>
              <span className="text-sm text-slate-500">{page}/{totalPages}</span>
              <Button variant="secondary" className="h-9 px-3" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau</Button>
            </div>
          </>
        ) : (
          <EmptyState title="Chưa có giao dịch" description="Thử thay đổi bộ lọc hoặc thêm giao dịch mới." actionLabel="Thêm giao dịch" onAction={openCreate} />
        )}
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title={editing ? 'Cập nhật giao dịch' : 'Thêm giao dịch'}>
        <form
          className="space-y-3"
          onSubmit={handleSubmit(async (values) => {
            if (editing) {
              await transactionService.update({ ...editing, ...values })
            } else {
              await transactionService.create(values)
            }
            setOpenModal(false)
          })}
        >
          <Input label="Tiêu đề" error={errors.title?.message} {...register('title')} />
          <Input label="Số tiền" type="number" error={errors.amount?.message} {...register('amount')} />
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Loại giao dịch</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" {...register('type')}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Danh mục</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" {...register('category')}>
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            {errors.category ? <span className="text-xs text-danger">{errors.category.message}</span> : null}
          </label>
          <Input label="Ngày" type="date" error={errors.date?.message} {...register('date')} />
          <Input label="Ghi chú" error={errors.note?.message} {...register('note')} />
          <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</Button>
        </form>
      </Modal>
    </div>
  )
}
