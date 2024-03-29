import { Block, BlockCreateInput } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

async function create(input: BlockCreateInput) {
    const res = await axiosClient.post("/blocks", input)
    return res.data as Block
}

async function deleteById({id}: {id: string}){
    await axiosClient.delete(`/blocks/${id}`)
}

const blockService = {
    create,
    deleteById
}

export default blockService