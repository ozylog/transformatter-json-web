import * as React from 'react';
import immer from 'immer';

type Action =
  { type: AppActionType.EDITOR_LOADING; payload: boolean } |
  { type: AppActionType.RESET }
;

function init() {
  return {
    isEditorLoading: false
  };
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case AppActionType.EDITOR_LOADING:
      return immer(state, (draft) => {
        draft.isEditorLoading = action.payload
      });
    case  AppActionType.RESET:
      return init();
    default:
      return state;
  }
};

const initialState: State = {
  isEditorLoading: false
};

const AppContext = React.createContext({ state: initialState , dispatch: (action: Action) => {} });

function AppProvider(props: React.PropsWithChildren<{}>) {
  const [ state, dispatch ] = React.useReducer(reducer, undefined, init);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };

export const enum AppActionType {
  EDITOR_LOADING = 'EDITOR_LOADING',
  RESET = 'RESET'
}

export interface State {
  isEditorLoading: boolean;
}
