import React, { useState, createContext, useContext, useReducer} from 'react';
import { reducer } from './reducers';
import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, 
  REGISTER_USER_ERROR, REGISTER_USER_SUCCESS
, LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, 
LOGIN_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, HANDLE_CHANGE,
UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR,
CREATE_JOB_BEGIN, CREATE_JOB_ERROR, CREATE_JOB_SUCCESS,
CLEAR_VALUES } from './actions';
import axios from 'axios';
// import { useNavigate  } from 'react-router-dom';
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const location = localStorage.getItem('location')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user && user !== 'undefined' ? JSON.parse(user) :  null,
    token: token ? token : null,
    userLocation: location ? location :  '',
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    // jobLocation
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobLocation: location ? location :  '',
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    // const navigate = useNavigate();
    const AuthFetch = axios.create({
      baseURL: '/api/v1',
    })

    AuthFetch.interceptors.request.use((config) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`;
      return config;
    }, (error) => {
      return Promise.reject(error);
    })

    AuthFetch.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      if (error?.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    })

    const displayAlert = () =>{
        dispatch({type:DISPLAY_ALERT})
        clearAlert();
    }
    const clearAlert = () => {
        setTimeout(() => {
          dispatch({
            type: CLEAR_ALERT,
          })
        }, 3000)
      }

      const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
      }
      const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
      }
    const registerUser = async (currentUser) => {
      dispatch({ type: REGISTER_USER_BEGIN});
      try {
        const res = await axios.post('api/v1/auth/register', currentUser);
        const { user, token, location } = res?.data;
        dispatch({ type: REGISTER_USER_SUCCESS, payload: {
          user,
          token,
          location
        }})
        addUserToLocalStorage({user, token, location})
      } catch(error) {
        dispatch({ type: REGISTER_USER_ERROR, payload: {
          msg: error?.response?.data?.msg || "Error occured!!!"
        }})
      }
    }

    const loginUser = async (currentUser) => {
      dispatch({ type: LOGIN_USER_BEGIN});
      try {
        const res = await axios.post('api/v1/auth/login', currentUser);
        const { user, token, location } = res?.data;
        dispatch({ type: LOGIN_USER_SUCCESS, payload: {
          user,
          token,
          location
        }})
        addUserToLocalStorage({user, token, location})
      } catch(error) {
        dispatch({ type: LOGIN_USER_ERROR, 
          payload: {
          msg: error?.response?.data?.msg || "Error occured!!!"
        }})
      }
    }

    const toggleSidebar =() => {
      dispatch( { type: TOGGLE_SIDEBAR})
    }

    const logoutUser = ( ) => {
      //navigate('login')
      dispatch( { type: LOGOUT_USER})
      removeUserFromLocalStorage();
      window.location = `${window.origin}/register`
    }
    const updateUser = async ( currentUser) => {
      dispatch({ type: UPDATE_USER_BEGIN })
      try {
        const {data} = await AuthFetch.patch('/auth/updateUser', currentUser)
        const { user, location, token } = data;
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: { user, location, token },
        })
    
        addUserToLocalStorage({ user, location, token })
      } catch( error ) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
      clearAlert()
    }
    const handleChange = ({ name, value }) => {
      dispatch({
        type: HANDLE_CHANGE,
        payload: { name, value },
      })
    }
    const clearValues = () => {
      dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
      dispatch({ type: CREATE_JOB_BEGIN })
      try {
        const { position, company, jobLocation, jobType, status } = state
    
        await AuthFetch.post('/jobs', {
          company,
          position,
          jobLocation,
          jobType,
          status,
        })
        dispatch({
          type: CREATE_JOB_SUCCESS,
        })
        // call function instead clearValues()
        dispatch({ type: CLEAR_VALUES })
      } catch (error) {
        if (error.response.status === 401) return
        dispatch({
          type: CREATE_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
      clearAlert()
    }
    return (
    <AppContext.Provider value={{...state, displayAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createJob }}>
        { children}
    </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext };