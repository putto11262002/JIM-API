import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetApplication } from "../hooks/application/useGetApplicationById";
import { cn } from "../lib/utils";
import { ModelApplication, ModelApplicationStatus } from "@jimmodel/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useAcceptApplication } from "../hooks/application/useAcceptApplication";
import { useToast } from "../components/ui/use-toast";
import { useArchiveApplication } from "../hooks/application/useArchiveApplication";

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="py-4">
      <h3 className="font-bold pb-2 text-lg">{title}</h3>
      <div className={className}>{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null | React.ReactNode;
}) {
  return (
    <div className="py-1">
      <p className="font-medium">{label}</p>
      <p className={cn(value ? "text-slate-600" : "text-slate-400", "text-sm")}>
        {value ?? "Unavailable"}
      </p>
    </div>
  );
}

function ApplicationDetailsPage() {
  const params = useParams();

  const { toast } = useToast();

  const { accept } = useAcceptApplication({
    onSuccess: () => {
      toast({ description: "Application accepted" });
    },
    onError: (err) => {
      toast({ description: err.message, variant: "destructive" });
    },
  });

  const { archive } = useArchiveApplication({
    onSuccess: () => {
      toast({ description: "Application archived" });
    },
    onError: (err) => {
      toast({ description: err.message, variant: "destructive" });
    },
  });

  const { isPending, data, error } = useGetApplication({ id: params.id });
  const navigate = useNavigate();

  return (
    <>
      <section className="flex gap-3 items-center">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        {/* <span className="bg-orange-300 py-2 px-3 rounded-sm">{data?.status}</span>  */}
      </section>
      <section className="py-3">
        {isPending ? (
          "Loading..."
        ) : error ? (
          <p>{error.message}</p>
        ) : (
          <div>
            {/* <h2 className="text-lg font-bold"> Model Application: {data?.id}</h2> */}
            <Section title="Personal Information">
              <Field label="First name" value={data?.firstName} />
              <Field label="Last name" value={data?.lastName} />
              <Field label="Email" value={data?.email} />
            </Section>

            <Section title="Contact Information">
              <Field label="Phone" value={data?.phoneNumber} />
              <Field label="Address" value={data?.email} />
              <Field label="Line" value={data?.lineId} />
              <Field label="WhatsApp" value={data?.whatsapp} />
              <Field label="WeChat" value={data?.wechat} />
            </Section>

            <Section title="Social Media">
              <Field label="Facebook" value={data?.facebook} />
              <Field label="Instagram" value={data?.instagram} />
            </Section>

            <Section title="Address Information">
              <Field label="Address" value={data?.address} />
              <Field label="City" value={data?.city} />
              <Field label="State" value={data?.region} />
              <Field label="Country" value={data?.country} />
              <Field label="Zip" value={data?.zipCode} />
            </Section>

            <Section title="Modeling Bio">
              <Field label="About Me" value={data?.aboutMe} />
              <Field label="Talents" value={data?.talents?.join(", ")} />
              <Field
                label="Experiences"
                value={
                  <ExperienceTable experiences={data?.experiences ?? []} />
                }
              />
            </Section>

            <Section title="Measurements">
              <Field label="Height" value={data?.height} />
              <Field label="Weight" value={data?.weight} />
              <Field label="Bust" value={data?.bust} />
              <Field label="Hips" value={data?.hips} />
              <Field label="Suit/Dress Size" value={data?.suitDressSize} />
              <Field label="Shoe Size" value={data?.shoeSize} />
              <Field label="Hair Color" value={data?.hairColor} />
              <Field label="Eye Color" value={data?.eyeColor} />
            </Section>

            <Section title="Images">
              <ImageGrid images={data?.images ?? []} />
            </Section>

            <div className="py-3 pb-5 space-x-4">
              <Button
                disabled={data?.status === ModelApplicationStatus.ACCEPTED}
                onClick={() => data?.id && accept(data.id)}
              >
                Accept
              </Button>
              <Button
                disabled={
                  data?.status === ModelApplicationStatus.ACCEPTED ||
                  data?.status === ModelApplicationStatus.ARCHIVED
                }
                onClick={() => data?.id && archive(data.id)}
                variant="outline"
              >
                Archive
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default ApplicationDetailsPage;

function ImageGrid({ images }: { images: ModelApplication["images"] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        <div className="">
          <img src={image.url} alt="Model Application Image" />
          <p className="pt-1">{image.type}</p>
        </div>
      ))}
    </div>
  );
}

function ExperienceTable({
  experiences,
}: {
  experiences: ModelApplication["experiences"];
}) {
  return (
    <Table className="p-0">
      <TableHeader>
        <TableRow>
          <TableHead className="text-black h-10">Year</TableHead>
          <TableHead className="text-black h-10">Product</TableHead>
          <TableHead className="text-black h-10">Media</TableHead>
          <TableHead className="text-black h-10">Country</TableHead>
          <TableHead className="text-black h-10">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiences?.map((experience) => (
          <TableRow>
            <TableCell>{experience.year}</TableCell>
            <TableCell>{experience.product}</TableCell>
            <TableCell>{experience.media}</TableCell>
            <TableCell>{experience.country}</TableCell>
            <TableCell>{experience.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
