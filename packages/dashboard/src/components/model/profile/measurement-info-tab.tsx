import { InfoBlock } from "./shared";
import LoaderBlock from "@/components/shared/loader-block";
import useGetModel from "../hooks/use-get-model";

export default function ModelMeasurementInfoTab({
  modelId
}: {
  modelId: string
}) {
  const { model, isPending } = useGetModel({ id: modelId });
  if (isPending || !model) {
    return <LoaderBlock message="Loading model data" />;
  }
  return (
    <div className="space-y-4">
      <InfoBlock label="Height" value={model.height} />
      <InfoBlock label="Weight" value={model.weight} />
      <InfoBlock label="Bust" value={model.bust} />
      <InfoBlock label="Collar" value={model.collar} />
      <InfoBlock label="Around Armpit" value={model.aroundArmpit} />
      <InfoBlock
        label="Around Arm to Wrist"
        value={
          !model.aroundArmToWrist1 &&
          !model.aroundArmToWrist2 &&
          !model.aroundArmToWrist3
            ? undefined
            : `${model.aroundArmToWrist1 ?? "-"} / ${
                model.aroundArmToWrist2 ?? "-"
              } / ${model.aroundArmToWrist3 ?? "-"}`
        }
      />
      <InfoBlock
        label="Arm Length"
        value={
          !model.armLength1 && !model.armLength2
            ? undefined
            : `${model.armLength1 ?? "-"} / ${model.armLength2 ?? "-"}`
        }
      />
      <InfoBlock
        label="Around Thigh to Ankle"
        value={model.aroundThickToAnkle}
      />
      <InfoBlock label="Trouser Length" value={model.trousersLength} />
      <InfoBlock label="Chest Height" value={model.chestHeight} />
      <InfoBlock label="Chest Width" value={model.chestWidth} />
      <InfoBlock label="Waist" value={model.waist} />
      <InfoBlock label="Hips" value={model.hips} />
      <InfoBlock label="Shoulder" value={model.shoulder} />
      <InfoBlock label="Front Shoulder" value={model.frontShoulder} />
      <InfoBlock label="Back Shoulder" value={model.backShoulder} />
      <InfoBlock label="Crotch" value={model.crotch} />
      <InfoBlock label="Bra Size" value={model.braSize} />
      <InfoBlock label="Suit/Dress Size" value={model.suitDressSize} />
      <InfoBlock label="Hair Color" value={model.hairColor} />
      <InfoBlock label="Eye Color" value={model.eyeColor} />
    </div>
  );
}
