import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { useGetModel } from "../../hooks/model/use-get-model";
import useUpdateModel from "../../hooks/model/use-update-model";

function ActionForm({modelId}: {modelId: string}){
    const {data} = useGetModel({modelId})
    const {update} = useUpdateModel()



    return (
        <div>
            <div className="flex flex-col">
                <Label className="mb-2 font-medium">Public</Label>
                <Switch checked={data.public} onCheckedChange={(val) => update({modelId, payload: {public: val}})} />
                <p className="text-sm text-muted-foreground mt-2">Makeing the model public will display the model to the public website</p>
            </div>
        </div>
    )
}

export default ActionForm