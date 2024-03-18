import z from "zod";
import ValidationError from "./errors/validation-error";


function zodErrorToValidationError(error: z.ZodError<any>){
  const details: Record<string, string> = {}
  error.errors.forEach(err => {
      if(err.path){
          details[err.path.join(".")] = err.message
      }
  })
  return new ValidationError("Validation error", details)
}


export function validate<T, S extends z.ZodObject<any, any>>(obj: T, schema: S): z.infer<S> {
  const validation = schema.safeParse(obj);

  if (!validation.success) {
      throw zodErrorToValidationError(validation.error);
  }

  return validation.data;
}