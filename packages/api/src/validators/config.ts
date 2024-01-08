import z from "zod";

export const ConfigSchema = z.object({
    port: z
        .number()
        .or(z.string())
        .transform((port, ctx) => {
            if (typeof port === "number") return port;
            const parsedPort = parseInt(port);
            if (isNaN(parsedPort)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    expected: "number",
                    received: "string",
                    path: ["port"],
                });
            }
            return parsedPort;
        }),
    jwtSecret: z.string().optional(),
});
