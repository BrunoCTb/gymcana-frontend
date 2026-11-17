
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  title: string
  action?: string
}

function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>

      {action && (
        <span className={styles.action}>
          {action}
        </span>
      )}
    </div>
  )
}

export default SectionHeader
