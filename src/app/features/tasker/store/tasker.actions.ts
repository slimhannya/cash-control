import { createAction, props } from '@ngrx/store';

import { Board } from '#tasker/models';
import { ActionTypes } from '#tasker/store/action-types';

export const loadBoards = createAction(ActionTypes.LOAD_BOARDS, props<{ uid: string }>());
export const loadBoardsSuccess = createAction(ActionTypes.LOAD_BOARDS_SUCCESS, props<{ boards: Board[] }>());
export const loadBoardsFailure = createAction(ActionTypes.LOAD_BOARDS_FAILURE);

export const addBoard = createAction(ActionTypes.ADD_BOARD, props<{ uid: string; name: string }>());
export const addBoardSuccess = createAction(ActionTypes.ADD_BOARD_SUCCESS);
export const addBoardFailure = createAction(ActionTypes.ADD_BOARD_FAILURE);

export const deleteBoard = createAction(ActionTypes.DELETE_BOARD, props<{ boardId: string }>());
export const deleteBoardSuccess = createAction(ActionTypes.DELETE_BOARD_SUCCESS);
export const deleteBoardFailure = createAction(ActionTypes.DELETE_BOARD_FAILURE);

export const setActiveBoard = createAction(ActionTypes.SET_ACTIVE_BOARD, props<{ id: string }>());
