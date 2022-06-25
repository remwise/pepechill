import { useContext } from 'react';

import { Context } from './context';

export const useData = () => useContext(Context);
