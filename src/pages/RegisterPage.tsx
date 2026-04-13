import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import { registerSchema } from '../features/auth/authSchemas'
import { authService } from '../services/api/authService'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) })

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Đăng ký</h1>
        <p className="mb-5 text-sm text-slate-500">Tạo tài khoản mới để bắt đầu quản lý giao dịch.</p>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await authService.register(values.name, values.email, values.password)
            navigate('/app/dashboard')
          })}
        >
          <Input label="Họ tên" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Mật khẩu" type="password" error={errors.password?.message} {...register('password')} />
          <Input label="Xác nhận mật khẩu" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </form>
        <div className="mt-4 text-sm">
          <Link className="text-primary" to="/login">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </Card>
    </main>
  )
}
