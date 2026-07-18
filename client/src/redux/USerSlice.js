import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
    name:"User",
    initialState:{
        userData:null,
        userInterviewData:null
    },
    reducers:{
        setUserData:((state,action)=>{
            state.userData = action.payload
        }),
        setInterviewData:((state,action)=>{
            state.userInterviewData = action.payload
        })

    }
})


export const {setUserData, setInterviewData} = userSlice.actions

export default userSlice.reducer