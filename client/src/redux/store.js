import { configureStore } from '@reduxjs/toolkit'
import userSlice from './USerSlice' 

export default configureStore({
  reducer: {
    user:userSlice
  },
})