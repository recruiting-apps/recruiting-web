import { cn } from '@/utils'

interface DividerProps {
  className?: string
}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div className={cn('border-b border-gray-300 my-4', className)} />
  )
}

export default Divider
