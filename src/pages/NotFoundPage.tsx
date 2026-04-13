import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <p className="text-sm text-primary">404</p>
        <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
        <Link to="/">
          <Button className="mt-4">Về trang chủ</Button>
        </Link>
      </div>
    </main>
  )
}
