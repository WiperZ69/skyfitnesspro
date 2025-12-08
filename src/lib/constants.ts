export const BASE_API_URL = 'https://wedev-api.sky.pro/api/fitness'

export const ROUTE_API_URL = {
	login: '/auth/login',
	register: '/auth/register',
	courses: '/courses',
	getCourse: '/courses/:id',
	getCourseWorkouts: '/courses/:id/workouts',
	userCourses: '/users/me',
	addUserCourse: '/users/me/courses',
	getCourseProgress: '/users/me/progress?courseId=',
}
