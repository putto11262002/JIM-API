import { useRef } from "react"


export default function FileUpload() {
    const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div >
        <input type="file" hidden ref={inputRef}/>
        

    </div>
  )
}
