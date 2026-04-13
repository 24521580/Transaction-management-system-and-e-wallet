import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import type { z } from 'zod'
import { forgotPasswordSchema } from '../features/auth/authSchemas'
import { authService } from '../services/api/authService'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) })

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
        <p className="mb-5 text-sm text-slate-500">Nhập email để nhận hướng dẫn khôi phục mật khẩu.</p>
        <form className="space-y-4" onSubmit={handleSubmit((values) => authService.forgotPassword(values.email))}>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Gửi yêu cầu
          </Button>
        </form>
        {isSubmitSuccessful ? <p className="mt-3 text-sm text-success">Đã gửi hướng dẫn về email của bạn.</p> : null}
        <div className="mt-4 text-sm">
          <Link className="text-primary" to="/login">
            Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </main>
  )
}
