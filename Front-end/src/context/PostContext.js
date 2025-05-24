import { createContext, useReducer, useEffect } from 'react'

export const PostContext = createContext()

export const postReducer = (state, action) => {
      return { post: action.payload }
}

export const PostContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, { 
    post: null,
  })

  //This useEffect keeps the user signedin if he closes the browser
useEffect(() => {
  
}, [])
  
  return (
    <PostContext.Provider value={{ ...state, dispatch }}>
      { children }
    </PostContext.Provider>
  )

}