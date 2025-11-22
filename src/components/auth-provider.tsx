import { User } from 'better-auth'
import { createContext, PropsWithChildren, use } from 'react'

const authContext = createContext<{
  user: User | null
}>({
  user: null,
})

export default function AuthProvider(
  props: PropsWithChildren<{
    user: User | null
  }>,
) {
  return (
    <authContext.Provider
      value={{
        user: props.user,
      }}
    >
      {props.children}
    </authContext.Provider>
  )
}

export const useAuth = () => {
  return use(authContext)
}
