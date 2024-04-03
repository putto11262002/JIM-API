import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetApplication } from "../hooks/application/use-get-application";
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
import { useAcceptApplication } from "../hooks/application/use-accept-application";
import { useArchiveApplication } from "../hooks/application/use-archive-application";
import ImageGallery from "../components/shared/image-gallery";

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
  const {id} = useParams<{id: string}>();

  const { accept } = useAcceptApplication();

  const { archive } = useArchiveApplication();

  const { application } = useGetApplication({ id: id! });

  const navigate = useNavigate();

  return (
    <>
      <section className="flex gap-3 items-center">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </section>
      <section className="py-3">
      
          <div>
            {/* <h2 className="text-lg font-bold"> Model Application: {data?.id}</h2> */}
            <Section title="Personal Information">
              <Field label="First name" value={application?.firstName} />
              <Field label="Last name" value={application?.lastName} />
              <Field label="Email" value={application?.email} />
            </Section>

            <Section title="Contact Information">
              <Field label="Phone" value={application?.phoneNumber} />
              <Field label="Address" value={application?.email} />
              <Field label="Line" value={application?.lineId} />
              <Field label="WhatsApp" value={application?.whatsapp} />
              <Field label="WeChat" value={application?.wechat} />
            </Section>

            <Section title="Social Media">
              <Field label="Facebook" value={application?.facebook} />
              <Field label="Instagram" value={application?.instagram} />
            </Section>

            <Section title="Address Information">
              <Field label="Address" value={application?.address} />
              <Field label="City" value={application?.city} />
              <Field label="State" value={application?.region} />
              <Field label="Country" value={application?.country} />
              <Field label="Zip" value={application?.zipCode} />
            </Section>

            <Section title="Modeling Bio">
              <Field label="About Me" value={application?.aboutMe} />
              <Field label="Talents" value={application?.talents?.join(", ")} />
              <Field
                label="Experiences"
                value={
                  <ExperienceTable experiences={application?.experiences ?? []} />
                }
              />
            </Section>

            <Section title="Measurements">
              <Field label="Height" value={application?.height} />
              <Field label="Weight" value={application?.weight} />
              <Field label="Bust" value={application?.bust} />
              <Field label="Hips" value={application?.hips} />
              <Field label="Suit/Dress Size" value={application?.suitDressSize} />
              <Field label="Shoe Size" value={application?.shoeSize} />
              <Field label="Hair Color" value={application?.hairColor} />
              <Field label="Eye Color" value={application?.eyeColor} />
            </Section>

            <Section title="Images">
              {/* <ImageGrid images={data?.images ?? []} /> */}
              <ImageGallery images={application?.images || []}/>
            </Section>

            <div className="py-3 pb-5 space-x-4">
              <Button
                disabled={application?.status === ModelApplicationStatus.ACCEPTED}
                onClick={() => application.id && accept({id: application.id})}
              >
                Accept
              </Button>
              <Button
                disabled={
                  application?.status === ModelApplicationStatus.ACCEPTED ||
                  application?.status === ModelApplicationStatus.ARCHIVED
                }
                onClick={() => application?.id && archive({id: application.id})}
                variant="outline"
              >
                Archive
              </Button>
            </div>
          </div>
      </section>
    </>
  );
}

export default ApplicationDetailsPage;

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
