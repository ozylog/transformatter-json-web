import * as React from 'react';
import ObjectId from 'bson-objectid';
import immer from 'immer';
import get from 'lodash.get';
import dayjs from 'dayjs';
import jsonStableStringify from 'json-stable-stringify';

interface Operation {
  type: 'BEAUTIFY';
  from: { format: 'JSON' };
  to: { format: 'JSON'; space: number | null; stable: boolean };
}

export const enum ActionType {
  CREATE_DATA = 'CREATE_DATA',
  DELETE_DATA = 'DELETE_DATA',
  SET_SELECTED_ID = 'SET_SELECTED_ID',
  SET_RAW = 'SET_RAW',
  SET_OPERATION = 'SET_OPERATION',
  SET_SPACE = 'SET_SPACE',
  SET_STABLE = 'SET_STABLE',
  RESET = 'RESET'
}

export interface Data {
  selectedId: string | null;
  data: {
    [key: string]: {
      id: string;
      name: string;
      type: string;
      raw: string | null;
      operation: Operation | null;
      result: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

type Action =
  { type: ActionType.CREATE_DATA } |
  { type: ActionType.DELETE_DATA; payload: string } |
  { type: ActionType.SET_SELECTED_ID; payload: string } |
  { type: ActionType.SET_RAW; payload: string | null } |
  { type: ActionType.SET_OPERATION; payload: Operation | null } |
  { type: ActionType.SET_SPACE; payload: number | null } |
  { type: ActionType.SET_STABLE; payload: boolean } |
  { type: ActionType.RESET }
;

function init() {
  return {
    selectedId: null,
    data: {}
  };
}

function getResult(raw: string | null, operation: Operation | null) {
  let result = '';

  if(!raw || !operation) return result;

  if (operation.type === 'BEAUTIFY' && operation.to.format === 'JSON') {
    const json = JSON.parse(raw);

    if (operation.to.stable) {
      result = jsonStableStringify(json, { space: operation.to.space || 0 });
    } else {
      result = JSON.stringify(json, null, operation.to.space || 0);
    }
  }

  return result;
}

const reducer = (state: Data, action: Action) => {
  switch (action.type) {
    case ActionType.CREATE_DATA:
      return immer(state, (draft) => {
        const date = new Date();
        const id = new ObjectId().str;

        draft.selectedId = id;
        draft.data[draft.selectedId] = {
          id,
          name: `${dayjs(date).format('DDMMM HH:mm:ss')}:${id.substr(id.length - 3)}`,
          type: 'JSON',
          raw: null,
          operation: null,
          result: null,
          createdAt: date,
          updatedAt: date
        };
      });
    case ActionType.DELETE_DATA:
      return immer(state, (draft) => {
        const sortedKeys = Object.values(draft.data)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((datum) => datum.id);

        if (sortedKeys.length > 1 && draft.data[action.payload]) {
          if (draft.selectedId === action.payload) {
            const idx = sortedKeys.indexOf(action.payload);
            draft.selectedId = sortedKeys[idx + 1] || sortedKeys[idx - 1];
          }

          delete draft.data[action.payload];
        }
      });
    case ActionType.SET_SELECTED_ID:
      return immer(state, (draft) => {
        if (draft.data[action.payload]) {
          draft.selectedId = action.payload
        }
      });
    case ActionType.SET_RAW:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.data[draft.selectedId]) {
          draft.data[draft.selectedId].raw = action.payload;
          draft.data[draft.selectedId].updatedAt = new Date();
        }
      });
    case ActionType.SET_OPERATION:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.data[draft.selectedId]) {
          const datum = draft.data[draft.selectedId];

          datum.operation = action.payload;
          datum.result = getResult(datum.raw, datum.operation);
          datum.updatedAt = new Date();
        }
      });
    case ActionType.SET_SPACE:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.data[draft.selectedId]) {
          const datum = draft.data[draft.selectedId];
          const toFormat = get(datum, 'operation.to.format');

          if (toFormat === 'JSON') {
            datum.operation!.to.space = action.payload;
            datum.result = getResult(datum.raw, datum.operation);
            datum.updatedAt = new Date();
          }
        }
      });
    case ActionType.SET_STABLE:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.data[draft.selectedId]) {
          const datum = draft.data[draft.selectedId];
          const toFormat = get(datum, 'operation.to.format');

          if (toFormat === 'JSON') {
            datum.operation!.to.stable = action.payload;
            datum.result = getResult(datum.raw, datum.operation);
            datum.updatedAt = new Date();
          }
        }
      });
    case  ActionType.RESET:
      return init();
    default:
      return state;
  }
};

const initialState: Data = {
  selectedId: null,
  data: {}
};

const DataContext = React.createContext({ state: initialState , dispatch: (action: Action) => {} });

function DataProvider(props: React.PropsWithChildren<{}>) {
  const [ state, dispatch ] = React.useReducer(reducer, undefined, init);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
