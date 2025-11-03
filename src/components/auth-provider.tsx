import { Models } from 'node-appwrite'
import { createContext, PropsWithChildren, use } from 'react'

const authContext = createContext<{
  user: Models.User<Models.Preferences> | null
  avatar: string | null
}>({
  user: null,
  avatar: null,
})

export default function AuthProvider(
  props: PropsWithChildren<{
    user: Models.User<Models.Preferences> | null
    avatar: string | null
  }>,
) {
  return (
    <authContext.Provider
      value={{
        user: props.user,
        avatar: props.avatar,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export const useAuth = () => {
  return use(authContext)
}
