'use client'

import type { Workout } from '@/lib/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './TrainingsModal.module.scss'

interface TrainingsModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	trainings: Workout[]
	loading?: boolean
	courseProgress?: {
		[workoutId: string]: { workoutCompleted: boolean }
	} | null
}

export default function TrainingsModal(props: TrainingsModalProps) {
	const { isOpen } = props
	if (!isOpen) return null

	return <ModalContent key={Number(isOpen)} {...props} />
}

function ModalContent({
	onClose,
	title = 'Выберите тренировку',
	trainings,
	loading = false,
	courseProgress = {},
}: TrainingsModalProps) {
	const [selected, setSelected] = useState<string | null>(null)
	const router = useRouter()

	const handleStart = () => {
		if (!selected) return
		onClose()
		router.push(`/fitness/workout?workoutId=${selected}`)
	}

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={e => e.stopPropagation()}>
				<h2 className={styles.title}>{title}</h2>

				<div className={styles.list}>
					{loading && <p className={styles.loading}>Загружаем…</p>}

					{!loading &&
						trainings.map((w, i) => {
							const completed = courseProgress?.[w._id]?.workoutCompleted

							return (
								<div
									key={w._id}
									className={`${styles.item} ${
										selected === w._id ? styles.selected : ''
									}`}
									onClick={() => setSelected(w._id)}
								>
									<div
										className={`${styles.checkbox} ${
											completed ? styles.done : ''
										}`}
									>
										{(completed || selected === w._id) && (
											<Image
												src='/done.svg'
												alt='done'
												width={24}
												height={24}
											/>
										)}
									</div>

									<div>
										<p className={styles.itemTitle}>{w.name}</p>
										<span className={styles.itemSubtitle}>
											Тренировка {i + 1}
										</span>
									</div>
								</div>
							)
						})}
				</div>

				<button
					className={styles.button}
					onClick={handleStart}
					disabled={!selected}
				>
					Начать
				</button>
			</div>
		</div>
	)
}
