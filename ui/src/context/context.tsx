import React from 'react';

import {
  DataComponent as DataProviderBase,
  Props as DataProps,
  RenderProps,
} from './index';

export const Context = React.createContext<RenderProps>({
  state: {
    userId: null,
    username: null,
    isLoadingUser: false,
  },
  loadUser: console.log,
  logout: console.log,
  sendData: console.log,
});

export const DataProvider: React.FC<Omit<DataProps, 'children'>> = (props) => (
  <DataProviderBase {...props}>
    {(renderProps) => (
      <Context.Provider value={renderProps}>{props.children}</Context.Provider>
    )}
  </DataProviderBase>
);
