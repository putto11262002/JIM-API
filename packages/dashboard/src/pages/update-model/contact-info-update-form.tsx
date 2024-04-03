import { ModelContactForm } from "../../components/model/contact-form";
import {useGetModel} from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

function ModelContactInfoUpdateForm({id}: {id: string}){
    const {model} = useGetModel({modelId: id})
    const {update} = useUpdateModel()
    return (
        <ModelContactForm onSubmit={(data) => update({modelId: id, payload: data})} initialData={model}/>
    )
}


export default ModelContactInfoUpdateForm