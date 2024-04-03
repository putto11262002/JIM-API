import useAppMutation from "../../lib/react-query-wrapper/use-app-mutation";
import { authenticate } from "../../redux/auth-reducer";
import { useAppDispatch } from "../../redux/hooks";
import staffService from "../../services/auth";

export function useLogin(){
  const dispatch= useAppDispatch()
  const returned = useAppMutation({
    mutationFn: staffService.login,
    notifySuccess: {notify: true, message: "Welcome back"},
    onSuccess: (loginreResult) => {
      dispatch(authenticate(loginreResult.staff))
    },
    notifyError: {notify: false}
  })

  return {...returned, login: returned.mutate}


}
