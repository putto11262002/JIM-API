import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation"
import { unauthenticate } from "../../redux/auth-reducer"
import { useAppDispatch } from "../../redux/hooks"
import staffService from "../../services/auth"

export function useLogout(){
  const dispatch= useAppDispatch()
  const returned = useAppMutation({
    mutationFn: staffService.logout,
    notifySuccess: {notify: true, message: "Goodbye"},
    onSuccess: () => {
      dispatch(unauthenticate())
    },
  })

  return {...returned, logout: returned.mutate}
}