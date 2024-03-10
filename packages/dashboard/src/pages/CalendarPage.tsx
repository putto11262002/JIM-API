import { useEffect } from "react"
import axiosClient from "../lib/axios"
import { useToast } from "../components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { AppErrorType } from "../types/app-error"
import { getAppError } from "../lib/error"

export default function CalendarPage() {
  const {toast} = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(async () => {
      try{
        const res = await axiosClient.get("/staffs/me")
      console.log(res.data)
      }catch(err){
        const errRes = getAppError(err)
        if (errRes.type === AppErrorType.AUTH_ERROR){
          navigate("/login")
          return 
        }
        toast({
          variant: "destructive",
          description: errRes.message,
        })
      }
    }, 1000 * 5)
    return () => clearInterval(timer)
  }, [])
  return (
    <div>CalendarPage</div>
  )
}
