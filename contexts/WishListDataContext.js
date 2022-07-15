//1. react context hook
//=====================
import { createContext } from 'react';
export const WishListDataContext = createContext({ storedWishListData: {}, setStoredWishListData: () => {} });