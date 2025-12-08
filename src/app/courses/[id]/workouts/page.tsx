export default async function WorkoutsList() {
	return (
		<div>
			<h1>Тренировки</h1>
			<ul>
				<li>1</li>
				{/* {workouts.map(w => (
					<li key={w._id}>
						<a href={`/workout/${w._id}`}>{w.name}</a>
					</li>
				))} */}
			</ul>
		</div>
	)
}
