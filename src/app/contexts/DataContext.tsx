import * as React from 'react';
import ObjectId from 'bson-objectid';
import immer from 'immer';
import dayjs from 'dayjs';

export const enum ActionType {
  CREATE_DATA = 'CREATE_DATA',
  DELETE_DATA = 'DELETE_DATA',
  UPDATE_DATA = 'UPDATE_DATA',
  SET_SELECTED_ID = 'SET_SELECTED_ID',
  RESET = 'RESET'
}

export interface Data {
  selectedId: string | null;
  data: {
    [key: string]: {
      id: string;
      name: string;
      input: string | null;
      inputFormat: Format.JSON | null;
      output: string | null;
      outputFormat: Format | null;
      outputSpace: number | null;
      outputStable: boolean | null;
      operator: Operator | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

type Action =
  { type: ActionType.CREATE_DATA } |
  { type: ActionType.DELETE_DATA; payload: string } |
  { type: ActionType.UPDATE_DATA; payload: Omit<Data, 'createdAt' | 'updatedAt'> } |
  { type: ActionType.SET_SELECTED_ID; payload: string } |
  { type: ActionType.RESET }
;

function init() {
  return {
    selectedId: null,
    data: {}
  };
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
          input: null,
          inputFormat: null,
          operator: null,
          output: null,
          outputFormat: null,
          outputSpace: null,
          outputStable: null,
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
    case ActionType.UPDATE_DATA:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.data[draft.selectedId]) {
          draft.data[draft.selectedId] = {
            ...draft.data[draft.selectedId],
            ...action.payload,
            updatedAt: new Date()
          };
        }
      });
    case ActionType.SET_SELECTED_ID:
      return immer(state, (draft) => {
        if (draft.data[action.payload]) {
          draft.selectedId = action.payload
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


export enum Format {
  JSON = 'JSON',
  XML = 'XML'
}

export enum Operator {
  BEAUTIFY_JSON = 'BEAUTIFY_JSON',
  CONVERT_JSON_TO_XML = 'CONVERT_JSON_TO_XML'
}
