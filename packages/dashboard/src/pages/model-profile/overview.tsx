import { useGetModel } from "@/hooks/model/use-get-model";

function ModelProfileOverview({ modelId }: { modelId: string }) {
  const { data: model } = useGetModel({ modelId });
  return (
    <div className="flex">
      <div className="h-[6em] w-[6em] rounded-full overflow-hidden bg-slate-300 relative">
        {model?.images?.[0] ? (
          <img
            src={model?.images?.[0]?.url}
            alt={model.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="bg-slate-300 absolute inset-0 z-10 text-white flex items-center justify-center text-5xl font-bold">
            {model.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex items-center ml-8 grow">
        <div>
          <h2 className="text-xl font-bold">{model.name}</h2>
          <p className="text-muted-foreground">{model.email}</p>
        </div>
        <div className="grow flex justify-end">
          {model.public && (
            <div className="border border-success/60 bg-success/5 flex items-center rounded-xl py-1 px-3">
              <div className="h-3 w-3 rounded-full bg-success"></div>
              <p className="ml-2 text-sm font-semibold text-success/80">
                Public
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelProfileOverview;
