import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store/useAppStore'
import { walletService } from '../services/api/walletService'
import { formatCurrency, formatDate } from '../utils/format'

export function WalletPage() {
  const { currentBalance, walletHistory } = useAppStore((state) => ({ currentBalance: state.currentBalance, walletHistory: state.walletHistory }))
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  return (
    <div className="space-y-4 pb-20 lg:pb-8">
      <Card title="Ví điện tử" subtitle="Nạp/rút/chuyển tiền nhanh chóng">
        <div className="mb-4 rounded-2xl bg-white/70 p-4">
          <p className="text-sm text-slate-500">Số dư hiện tại</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(currentBalance)}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Loại thao tác</span>
            <select className="h-11 rounded-input border border-white/60 bg-white/75 px-4" value={action} onChange={(event) => setAction(event.target.value as typeof action)}>
              <option value="deposit">Nạp tiền</option>
              <option value="withdraw">Rút tiền</option>
              <option value="transfer">Chuyển tiền</option>
            </select>
          </label>
          <Input label="Số tiền" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <Input label="Ghi chú" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <Button
          className="mt-4"
          onClick={async () => {
            if (!Number(amount)) return
            await walletService.operate(action, Number(amount), note)
            setAmount('')
            setNote('')
          }}
        >
          Xác nhận thao tác
        </Button>
      </Card>

      <Card title="Lịch sử biến động số dư">
        <div className="space-y-2">
          {walletHistory.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{item.action.toUpperCase()}</p>
                <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
              </div>
              <p className="font-semibold">{formatCurrency(item.amount)}</p>
              <p className="text-slate-500">Số dư: {formatCurrency(item.balanceAfter)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
