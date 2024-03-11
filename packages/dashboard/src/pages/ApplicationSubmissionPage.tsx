import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Plus, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../components/ui/select";
import {
  ModelApplication, ModelApplicationCreateInput, ModelApplicationExperienceCreateInput,
} from "@jimmodel/shared";
import { useMutation } from "@tanstack/react-query";
// import _ from "lodash";
import axiosClient from "../lib/axios";

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-bold pt-4 text-lg">{title}</h2>
      {description && <p className="text-slate-500">{description}</p>}
      <div className="grid grid-cols-2 gap-y-5 gap-x-3 py-2">{children}</div>
    </div>
  );
}

function FormSubSection({
  title,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h3 className="text-slate-700 col-span-2 pt-2 font-semibold">{title}</h3>
    </>
  );
}

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const CreateModelApplicationFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  lineId: z.string().optional(),
  wechat: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  dateOfBirth: z.date(),
  gender: z.string(),
  nationality: z.string(),
  ethnicity: z.string(),
  address: z.string(),
  city: z.string(),
  region: z.string(),
  zipCode: z.string(),
  country: z.string(),
  talents: z.array(z.string().min(1, "Required")).optional(),
  aboutMe: z.string(),
  experiences: z
    .array(
      z.object({
        year: z.string(),
        media: z.string(),
        country: z.string(),
        product: z.string(),
        details: z.string().optional(),
      })
    )
    .optional(),
  height: z.string(),
  weight: z.string(),
  bust: z.string(),
  hips: z.string(),
  suitDressSize: z.string(),
  shoeSize: z.string(),
  eyeColor: z.string(),
  hairColor: z.string(),
  midlengthImage: z
    .any()
    .refine((file) => file instanceof File, "Required")
    .refine((file) => allowedImageTypes.includes(file?.type), "Invalid image")
    .refine((file) => file?.size < 5000000, "File size must be less than 5MB"),
  closeUpImage: z
    .any()
    .refine((file) => file instanceof File, "Required")
    .refine((file) => allowedImageTypes.includes(file?.type), "Invalid image")
    .refine((file) => file?.size < 5000000, "File size must be less than 5MB"),
  fullLengthImage: z
    .any()
    .refine((file) => file instanceof File, "Required")
    .refine((file) => allowedImageTypes.includes(file?.type), "Invalid image")
    .refine((file) => file?.size < 5000000, "File size must be less than 5MB"),
});

const Gender = {
  MALE: "male",
  FEMALE: "female",
};

const Nationality = {
  THAI: "thai",
  AMERICA: "america",
};

const Ethnicity = {
  ASIA: "asia",
  WHITE: "white",
  BLACK: "black",
  LATINO: "latino",
  OTHER: "other",
};

export default function ApplicationSubmissionPage() {
  const form = useForm<z.infer<typeof CreateModelApplicationFormSchema>>({
    resolver: zodResolver(CreateModelApplicationFormSchema),
  });

  const talents = form.watch("talents") || [];
  const experiences = form.watch("experiences") || [];

  const {mutate: handleSubmitApplication} = useMutation({
    mutationFn: async (
      data: z.infer<typeof CreateModelApplicationFormSchema>
    ) => {
     
      

      const res = await axiosClient.post("/model-applications", data, {})

    // return res.data;

    const formData = new FormData();
    formData.append("midlengthImage", data.midlengthImage);
    formData.append("closeupImage", data.closeUpImage);
    formData.append("fulllengthImage", data.fullLengthImage);
    const res2 = await axiosClient.post("/model-applications/" + res.data.id + "/images", formData, {headers: {"Content-Type": "multipart/form-data"}})
    console.log(res2)
    },
  });

  return (
    <div className="">
      <main className="mx-auto max-w-[700px] w-full pt-5 pb-5 px-3 md:px-0">
        <a href="https://jimmodel.com">
          <h1 className="text-2xl font-bold">J.I.M Model Agency</h1>
        </a>
        <h2 className="text-lg text-slate-500">Model application form</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleSubmitApplication(data))}
            className="pt-6 pb-3 space-y-2"
          >
            <FormSection title="Personal Information">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-3 py-2">
                    <FormLabel className="block">Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              dayjs(field.value).format("DD/MM/YYYY")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select your gender"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Gender).map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Nationality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select your nationality"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Nationality).map((nationality) => (
                          <SelectItem key={nationality} value={nationality}>
                            {nationality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Ethnicity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select your ethnicity"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Ethnicity).map((ethnicity) => (
                          <SelectItem key={ethnicity} value={ethnicity}>
                            {ethnicity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Contact Information">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormSubSection title="Alternative Contact Information">
                <FormField
                  control={form.control}
                  name="lineId"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lineId"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Line ID</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSubSection>

              <FormField
                control={form.control}
                name="lineId"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Line ID</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wechat"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>WeChat</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Social Media">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Address Information">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Region/State</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Modeling Bio">
              <FormField
                control={form.control}
                name="aboutMe"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-non"
                        placeholder="Tell us a little bit about yourself"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="col-span-2 space-y-2 py-2">
                <p className="text-sm font-semibold">Talents</p>
                <div className="flex flex-col gap-3">
                  {talents.map((_, index) => (
                    <div
                      key={index}
                      className="group w-full p-4 border rounded-md relative"
                    >
                      <div
                        onClick={() => {
                          const talents = form.getValues().talents || [];
                          talents.splice(index, 1);
                          form.setValue("talents", talents);
                        }}
                        className="flex w-[25px] h-[25px] absolute border justify-center items-center rounded-full top-[-12.5px] right-[-12.5px] bg-white cursor-pointer"
                      >
                        <X className="h-[15px] w-[15px] text-destructive" />
                      </div>
                      <FormField
                        control={form.control}
                        name={`talents.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Talent..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  className="flex gap-1"
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    const talents = form.getValues().talents || [];
                    talents.push("");
                    form.setValue("talents", talents);
                  }}
                >
                  <Plus className="h-4 w-4 " />
                  Talent
                </Button>
              </div>

              <div className="col-span-2 space-y-2 py-2">
                <p className="text-sm font-semibold">Experiences</p>
                <div className="flex flex-col gap-3">
                  {experiences.map((_, index) => (
                    <div
                      key={index}
                      className="group w-full p-4 border rounded-md relative grid grid-cols-2 gap-3"
                    >
                      <div
                        onClick={() => {
                          const experiences =
                            form.getValues().experiences || [];
                          experiences.splice(index, 1);
                          form.setValue("experiences", experiences);
                        }}
                        className="flex w-[25px] h-[25px] absolute border justify-center items-center rounded-full top-[-12.5px] right-[-12.5px] bg-white cursor-pointer"
                      >
                        <X className="h-[15px] w-[15px] text-destructive" />
                      </div>

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.year`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.media`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Media</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.country`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.product`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.details`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                // className="resize-non"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  className="flex gap-1"
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    const experiences = form.getValues().experiences || [];
                    experiences.push({}  );
                    form.setValue("experiences", experiences);
                  }}
                >
                  <Plus className="h-4 w-4 " />
                  Experience
                </Button>
              </div>
            </FormSection>

            <FormSection title="Measurements">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bust"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chest/Bust/Cup</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hips</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suitDressSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suit/Dress Size</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shoeSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shoe Size</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eyeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eye Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hairColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hair Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Images">
              <FormField
                control={form.control}
                name="midlengthImage"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Mid-length Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target?.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closeUpImage"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Close-up Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target?.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullLengthImage"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full-length Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target?.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
            <div>
              <Button>Submit</Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
