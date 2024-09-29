
import { usePathname } from 'next/navigation'

const useOverflow = () => {
  const pathname = usePathname()
  const overflow = ['/check-in'].includes(pathname) ? 'overflow-hidden' : ''
  return [overflow]
}

export default useOverflow