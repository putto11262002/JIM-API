import { ModelContactForm } from "../../components/model/contact-form";
import LoaderBlock from "../../components/shared/loader-block";
import useGetModel from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

export default function ModelContactInfoUpdateForm({id}: {id: string}){
    const {model,isPending} = useGetModel({id})
    const {update} = useUpdateModel()
    if (isPending || !model){
        return <LoaderBlock message="Loading model data"/>
    }
    return (
        <ModelContactForm onSubmit={(data) => update({id, input: data})} initialData={model}/>
    )
}