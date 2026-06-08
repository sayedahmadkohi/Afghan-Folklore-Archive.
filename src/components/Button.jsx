import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', ...props }) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-accent to-secondary-accent text-background hover:shadow-lg hover:shadow-primary-accent/20',
    secondary: 'bg-card-background border border-border text-text-primary hover:border-primary-accent hover:text-primary-accent',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-card-background',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button
