import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    case 'DELETE':
      return { user: null}
    case 'AUTH_READY': //This one is for the navigation using URL and refreshing the page
      return { user: action.payload, loading: false }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    loading: true
  })

  //This useEffect keeps the user signedin if he closes the browser
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if(user){
    dispatch({type: 'LOGIN', payload:user})
    dispatch({ type: 'AUTH_READY', payload: user })
  }
}, [])

    if(state.user)
        {console.log('AuthContext state:', state)}
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}