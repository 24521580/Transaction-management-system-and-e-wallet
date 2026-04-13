import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { authService } from '../services/api/authService'
import { loginSchema } from '../features/auth/authSchemas'
import type { z } from 'zod'

export function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'demo@wallet.vn', password: '123456' },
  })

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="mb-5 text-sm text-slate-500">Chào mừng quay lại hệ thống quản lý ví điện tử.</p>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await authService.login(values.email, values.password)
            navigate('/app/dashboard')
          })}
        >
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Mật khẩu" type="password" error={errors.password?.message} {...register('password')} />
          <Button type="submit" fullWidth disabled={isSubmitting} aria-label="Đăng nhập hệ thống">
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link className="text-primary" to="/forgot-password">
            Quên mật khẩu?
          </Link>
          <Link className="text-primary" to="/register">
            Tạo tài khoản
          </Link>
        </div>
      </Card>
    </main>
  )
}
