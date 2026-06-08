import { motion } from 'framer-motion'

const Input = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-text-secondary" />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          className={`w-full bg-card-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-accent transition-all duration-300 ${Icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

export default Input
