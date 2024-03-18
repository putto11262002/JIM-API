import { Block, BlockCreateInput } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

async function create(input: BlockCreateInput) {
    const res = await axiosClient.post("/blocks", input)
    return res.data as Block
}

const blockService = {
    create
}

export default blockService