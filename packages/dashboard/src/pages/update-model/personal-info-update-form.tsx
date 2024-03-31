import { PersonalForm } from "../../components/model/personal-form";
import LoaderBlock from "../../components/shared/loader-block";
import useGetModel from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

export default function ModelPersonalInfoUpdateForm({id}: {id: string}){
    const {model, isPending} = useGetModel({id})

    const {update} = useUpdateModel()
    if (isPending || !model){
        return <LoaderBlock message="Loading model data"/>
    }
    return <PersonalForm onSubmit={(data) => update({id, input: data})} initialData={model}/>
}