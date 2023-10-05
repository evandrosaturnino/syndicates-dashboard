type CardProps = { 
  children: React.ReactNode
  className?: string
};

function Card({ 
  className,
  children
}: CardProps) {
  return <div className={`flex flex-col rounded-xl bg-grey border border-grey2 ${className}`}>
      {children}
    </div>
}

export default Card;
