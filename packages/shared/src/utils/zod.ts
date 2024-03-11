import { z } from "zod";

export const schemaForType = <T>() => <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };
  