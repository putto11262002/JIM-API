import { Outlet } from 'react-router-dom'
import { cn } from '../../lib/utils'

export default function FormLayout({className, children}: {className?: string, children?: React.ReactNode}) {
  return (
    <main className='w-screen min-h-[100vh] h-full'>
        <div className={cn('max-w-[350px] mx-auto px-2 md:px-0', className)}>
            
        {children ? children : <Outlet/>}
        </div>
    </main>
  )
}
