import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//Make http POST request to login user
export const userLogin = createAsyncThunk('loginuser',async(userCredentrialsObject,thunkApi)=>{

    let response = await axios.post('http://localhost:8000/user-api/login',userCredentrialsObject);
    console.log(response)
    let data = response.data;
    if(data.message==='success'){
        //store token in local storage
        localStorage.setItem("token",data.payload);
        return data.userObj;
    }
    if(data.message==='Invalid username' || data.message==='Invalid password'){
        return thunkApi.rejectWithValue(data)
    }

});

let userSlice = createSlice({
    name:'user',
    initialState:{
        userObj:{},
        isError:false,
        isSuccess:false,
        isLoading:false,
        errMsg:''
    },

    reducers:{
        clearLoginStatus:(state)=>{
            state.isSuccess = false;
            state.userObj = null;
            state.isError = false;
            state.errMsg = '';
            return state;
        }
    },

    extraReducers:{
        //track life cycle of promisereturned by createAsyncThunk function
        [userLogin.pending]:(state,action)=>{
            state.isLoading = true;
        },

        [userLogin.fulfilled]:(state,action)=>{
            state.userObj = action.payload;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.errMsg = ''
        },

        [userLogin.rejected]:(state,action)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.errMsg = action.payload.message;
        }
    }
})

//export action creators
export const {clearLoginStatus}=userSlice.actions;
//export reducer
export default userSlice.reducer