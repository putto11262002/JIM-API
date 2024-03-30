import { Model } from "@jimmodel/shared";
import { InfoBlock } from "./shared";

export default function ModelContactInfoTab({model}: {model: Model}) {
    return (
        <div className="space-y-4">
            <InfoBlock label="Email" value={model.email}/>
            <InfoBlock label="Phone Number" value={model.phoneNumber}/>
            <InfoBlock label="Line ID" value={model.lineId}/>
            <InfoBlock label="WhatsApp" value={model.whatsapp}/>
            <InfoBlock label="WeChat" value={model.wechat}/>
            <InfoBlock label="Instagram" value={model.instagram}/>
            <InfoBlock label="Facebook" value={model.facebook}/>
        </div>
    )
}