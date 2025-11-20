import {configureStore , combineReducers} from "@reduxjs/toolkit"
import  useReducer  from "./redux/userSlice.js"
import { persistStore, persistReducer } from 'redux-persist'
import sessionStorage from "redux-persist/lib/storage/session"


const rootReducer = combineReducers({
	user: useReducer
})

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

 
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => 
	    getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store)