import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import { Note, Task, TaskFilter } from '#pages/dashboard/features/tasker/models';
import { AuthActions } from '#store/auth';
import { TaskerActions } from '#store/tasker';

export const FeatureKey = 'tasker';

export interface State {
  tasks: Task[] | null;
  notes: Note[] | null;
  isLoading: boolean;
  filter: TaskFilter;
}

const initialState: State = {
  tasks: null,
  notes: null,
  isLoading: false,
  filter: 'all',
};

export const Reducer: ActionReducer<State, Action> = createReducer(
  initialState,

  // get tasks data
  on(TaskerActions.getTaskerUserData, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(TaskerActions.getTaskerUserDataSuccess, (state: State, { tasks, notes }): State => {
    return { ...state, tasks, notes, isLoading: false };
  }),
  on(TaskerActions.getTaskerUserDataError, (state): State => {
    return { ...state, isLoading: false };
  }),

  // add task
  on(TaskerActions.addTask, (state, { task }): State => {
    return { ...state, tasks: [...(state.tasks as Task[]), task] };
  }),
  on(TaskerActions.addTaskSuccess, (state): State => {
    return { ...state };
  }),
  on(TaskerActions.addTaskFailure, (state): State => {
    return { ...state };
  }),

  // add note
  on(TaskerActions.addNote, (state, { note }): State => {
    return { ...state, notes: [...(state.notes as Note[]), note] };
  }),
  on(TaskerActions.addNoteSuccess, (state): State => {
    return { ...state };
  }),
  on(TaskerActions.addNoteFailure, (state): State => {
    return { ...state };
  }),

  // set filter
  on(TaskerActions.setFilter, (state, { filter }) => {
    return { ...state, filter };
  }),

  // on signout
  on(AuthActions.signOut, (): State => {
    return { filter: 'all', isLoading: false, tasks: null, notes: null };
  })
);
