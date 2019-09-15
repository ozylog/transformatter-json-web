import * as React from 'react';
import ObjectId from 'bson-objectid';
import immer from 'immer';
import dayjs from 'dayjs';

type Action =
  { type: ActionType.CREATE_ITEM } |
  { type: ActionType.DELETE_ITEM; payload: string } |
  { type: ActionType.PATCH_ITEM; payload: Partial<Omit<Json, 'createdAt' | 'updatedAt'>> } |
  { type: ActionType.SET_SELECTED_ID; payload: string } |
  { type: ActionType.RESET }
;

function init() {
  return {
    selectedId: null,
    items: {}
  };
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.CREATE_ITEM:
      return immer(state, (draft) => {
        const date = new Date();
        const id = new ObjectId().str;

        draft.selectedId = id;
        draft.items[draft.selectedId] = {
          id,
          name: `${dayjs(date).format('DDMMM HH:mm:ss')}:${id.substr(id.length - 3)}`,
          input: null,
          inputFormat: null,
          operator: null,
          output: null,
          outputFormat: null,
          outputSpace: null,
          outputStable: null,
          errorMessage: null,
          createdAt: date,
          updatedAt: date
        };
      });
    case ActionType.DELETE_ITEM:
      return immer(state, (draft) => {
        const sortedKeys = Object.values(draft.items)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((item) => item.id);

        if (sortedKeys.length > 1 && draft.items[action.payload]) {
          if (draft.selectedId === action.payload) {
            const idx = sortedKeys.indexOf(action.payload);
            draft.selectedId = sortedKeys[idx + 1] || sortedKeys[idx - 1];
          }

          delete draft.items[action.payload];
        }
      });
    case ActionType.PATCH_ITEM:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.items[draft.selectedId]) {
          draft.items[draft.selectedId] = {
            ...draft.items[draft.selectedId],
            ...action.payload,
            updatedAt: new Date()
          };
        }
      });
    case ActionType.SET_SELECTED_ID:
      return immer(state, (draft) => {
        if (draft.items[action.payload]) {
          draft.selectedId = action.payload
        }
      });
    case  ActionType.RESET:
      return init();
    default:
      return state;
  }
};

const initialState: State = {
  selectedId: null,
  items: {}
};

const ItemsContext = React.createContext({ state: initialState , dispatch: (action: Action) => {} });

function ItemsProvider(props: React.PropsWithChildren<{}>) {
  const [ state, dispatch ] = React.useReducer(reducer, undefined, init);

  return (
    <ItemsContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ItemsContext.Provider>
  );
}

export { ItemsContext, ItemsProvider };


export enum Format {
  JSON = 'JSON',
  XML = 'XML'
}

export enum Operator {
  BEAUTIFY_JSON = 'BEAUTIFY_JSON',
  CONVERT_JSON_TO_XML = 'CONVERT_JSON_TO_XML'
}

export const enum ActionType {
  CREATE_ITEM = 'CREATE_ITEM',
  DELETE_ITEM = 'DELETE_ITEM',
  PATCH_ITEM = 'PATCH_ITEM',
  SET_SELECTED_ID = 'SET_SELECTED_ID',
  RESET = 'RESET'
}

export interface Json {
  id: string;
  name: string;
  input: string | null;
  inputFormat: Format.JSON | null;
  output: string | null;
  outputFormat: Format | null;
  outputSpace: number | null;
  outputStable: boolean | null;
  operator: Operator | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface State {
  selectedId: string | null;
  items: {
    [key: string]: Json;
  };
}
