import styles from './ProgressBar.module.scss'

type ProgressBarProps = {
	progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
	return (
		<div className={styles.wrapper}>
			<div className={styles.track}>
				<div className={styles.progress} style={{ width: `${progress}%` }} />
			</div>
		</div>
	)
}
