import { Model } from "@jimmodel/shared";
import { InfoBlock } from "./shared";
import ExperienceTable from "../experience-table";

export default function ModelBackgroundInfoTab({model}: {model: Model}) {
    return (
        <div className="space-y-4">
            <InfoBlock label="Occupation" value={model.occupation}/>
            <InfoBlock label="Highest Level of Education" value={model.highestLevelOfEducation}/>
            <InfoBlock label="Medical Background" value={model.medicalBackground}/>
            <InfoBlock label="About Me" value={model.aboutMe}/>
            <InfoBlock label="Talents" value={model.talents.join(", ")}/> 
            <div>
            <p className="font-medium text-sm">Experiences</p>
            <ExperienceTable experiences={model.experiences}/>
            </div>
        </div>
    )
}