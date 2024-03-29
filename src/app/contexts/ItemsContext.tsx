import * as React from 'react';
import ObjectId from 'bson-objectid';
import immer from 'immer';

type Action =
  { type: ItemsActionType.CREATE_ITEM } |
  { type: ItemsActionType.DELETE_ITEM; payload: string } |
  { type: ItemsActionType.PATCH_ITEM; payload: Partial<Omit<Json, 'createdAt' | 'updatedAt'>> } |
  { type: ItemsActionType.SET_SELECTED_ID; payload: string } |
  { type: ItemsActionType.RESET }
;

function init() {
  return {
    selectedId: null,
    items: {}
  };
}

let sequence =  1;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ItemsActionType.CREATE_ITEM:
      return immer(state, (draft) => {
        const date = new Date();
        const id = new ObjectId().str;

        draft.selectedId = id;
        draft.items[draft.selectedId] = {
          id,
          name: `Untitled ${sequence}`,
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

        sequence++;
      });
    case ItemsActionType.DELETE_ITEM:
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
    case ItemsActionType.PATCH_ITEM:
      return immer(state, (draft) => {
        if (draft.selectedId && draft.items[draft.selectedId]) {
          draft.items[draft.selectedId] = {
            ...draft.items[draft.selectedId],
            ...action.payload,
            updatedAt: new Date()
          };
        }
      });
    case ItemsActionType.SET_SELECTED_ID:
      return immer(state, (draft) => {
        if (draft.items[action.payload]) {
          draft.selectedId = action.payload
        }
      });
    case  ItemsActionType.RESET:
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

export const enum ItemsActionType {
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
