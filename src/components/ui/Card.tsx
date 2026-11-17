
import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLElement>

function Card({ className, children, ...props }: CardProps) {
  return (
    <article
      {...props}
      className={`${styles.card} ${className ?? ''}`}
    >
      {children}
    </article>
  )
}

export default Card
