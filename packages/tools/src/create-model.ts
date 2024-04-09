import { Model } from "@prisma/client"
import fs from "node:fs"
import path from "path"
import FormData from "form-data"
import { File } from "node:buffer"
import axios from "axios"

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1NmJkZjlhLTUxZWMtNDkxOS04ZDAxLTM3ZjU3ZWZiOGE0YiIsInJvbGUiOiJST09UIiwiaWF0IjoxNzEyNTg5MzUxLCJleHAiOjE3MTI1OTAyNTF9.vAUnQALk_spKJExM9St4S14jJkyC5-GfPPYBN9x2e6o"

async function main() {
  const data = fs.readFileSync("./data/men/aggregated.json", "utf-8")
  const models = JSON.parse(data)

  for (const model of models) {
    const res = await fetch("http://localhost:3002/api/models", {method: "POST", body: JSON.stringify(model), headers: {"Content-Type": "application/json", "Authorization": `Bearer ${authToken}`}})
    const createdModel: Model = await res.json();

    for (const imagePath of model?.images || []) {
      const formData = new FormData({})
      const buffer = fs.readFileSync(imagePath)
      const ext = path.extname(imagePath).slice(1)
      const fileName = `image.${ext}`
      const mimeType = `image/${ext}`
      
      formData.append("image", buffer, {filename: fileName, contentType: mimeType} )
      formData.append("type", "polaroid")

      try {
        const response = await axios.post(`http://localhost:3002/api/models/${createdModel.id}/images`, formData, {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "ContentType": "multipart/form-data"
          }
        })

        

        const result = await response.data
        console.log(result)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}

main()