import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { passwordSchema, profileSchema } from '../features/settings/settingsSchemas'
import { useAppStore } from '../store/useAppStore'

export function ProfileSettingsPage() {
  const { user, updateProfile, changePassword, darkMode, toggleDarkMode } = useAppStore((state) => ({
    user: state.user,
    updateProfile: state.updateProfile,
    changePassword: state.changePassword,
    darkMode: state.darkMode,
    toggleDarkMode: state.toggleDarkMode,
  }))

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  })

  return (
    <div className="grid gap-4 pb-20 lg:grid-cols-2 lg:pb-8">
      <Card title="Thông tin cá nhân">
        <form className="space-y-3" onSubmit={profileForm.handleSubmit((values) => updateProfile(values))}>
          <Input label="Họ tên" error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
          <Input label="Email" error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
          <Input label="Số điện thoại" error={profileForm.formState.errors.phone?.message} {...profileForm.register('phone')} />
          <Button type="submit">Lưu thay đổi</Button>
        </form>
      </Card>

      <Card title="Bảo mật & giao diện">
        <form className="space-y-3" onSubmit={passwordForm.handleSubmit(async (values) => {
          await changePassword(values.oldPassword, values.newPassword)
          passwordForm.reset()
        })}>
          <Input label="Mật khẩu cũ" type="password" error={passwordForm.formState.errors.oldPassword?.message} {...passwordForm.register('oldPassword')} />
          <Input label="Mật khẩu mới" type="password" error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
          <Input label="Xác nhận mật khẩu" type="password" error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register('confirmPassword')} />
          <Button type="submit">Đổi mật khẩu</Button>
        </form>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/70 p-3">
          <div>
            <p className="text-sm font-semibold">Dark mode</p>
            <p className="text-xs text-slate-500">Bật/tắt giao diện tối</p>
          </div>
          <Button variant="secondary" className="h-9 px-3" onClick={toggleDarkMode}>
            {darkMode ? 'Đang bật' : 'Đang tắt'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
