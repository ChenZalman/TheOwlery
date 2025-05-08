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
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  //This useEffect keeps the user signedin if he closes the browser
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'))

  if(user){
    dispatch({type: 'LOGIN', payload:user})
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