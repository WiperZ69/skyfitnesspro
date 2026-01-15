import { initialState } from './authSlice';

import { authSlice } from './authSlice';

import userData from '../../data/userData';

describe('updateSelectedCourses', () => {
  const storeState: initialState = {
    isSignup: false,
    user: {
      userId: '',
      email: '',
      token: '',
      selectedCourses: userData.selectedCourses,
      courseProgress: [],
    },
  };

  it('удаление уже выбранного пользователем курса', () => {
    const initialState = {
      ...storeState,
    };

    const newState = authSlice.reducer(
      initialState,
      authSlice.actions.updateSelectedCourses('ab1c3f'),
    );

    expect(newState.user.selectedCourses).toStrictEqual(['ypox9r', 'kfpq8e']);
  });

  it('добавление нового, ранее не выбранного курса', () => {
    const initialState = {
      ...storeState,
    };

    const newState = authSlice.reducer(
      initialState,
      authSlice.actions.updateSelectedCourses('q02a6i'),
    );

    expect(newState.user.selectedCourses).toStrictEqual([
      'ab1c3f',
      'ypox9r',
      'kfpq8e',
      'q02a6i',
    ]);
  });
});
