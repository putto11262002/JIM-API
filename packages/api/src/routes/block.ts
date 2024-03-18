import express from "express"
import blockController from "../controllers/block"
const blockRouter = express.Router()

blockRouter.post("/blocks", blockController.create)

blockRouter.delete("/blocks/:id", blockController.deleteById)

export default blockRouter