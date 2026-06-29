import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  icon?: React.ReactNode
}

const base = 'inline-flex items-center gap-2 rounded-lg font-medium transition-colors'

const variants: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
}

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
}

export default function Button({ children, variant = 'primary', size = 'md', to, href, className = '', onClick, type = 'button', disabled, icon }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`

  if (to && !disabled) {
    return <Link to={to} className={cls}>{icon}{children}</Link>
  }
  if (href && !disabled) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{icon}{children}</a>
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {icon}{children}
    </button>
  )
}
