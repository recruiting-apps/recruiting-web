interface FormGridProps {
  children?: React.ReactNode
  cols: 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | 'grid-cols-5' | 'grid-cols-6' | 'grid-cols-7' | 'grid-cols-8' | 'grid-cols-9' | 'grid-cols-10' | 'grid-cols-11' | 'grid-cols-12'
  className?: string
}

const FormGrid: React.FC<FormGridProps> = ({ cols, className, children }) => {
  return (
    <div className={`md:grid ${cols} gap-4 ${className} place-content-center`}>
      {children}
    </div>
  )
}

export default FormGrid
