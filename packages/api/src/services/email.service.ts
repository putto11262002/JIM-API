import { injectable } from "inversify";
import type { Email } from "../types/email";

export interface IEmailService {
    init: () => Promise<void>;
    sendEmail: (email: Email) => Promise<void>;
}

@injectable()
export class EmailService implements IEmailService {
    public async init(): Promise<void> {
        console.log("Initializing email service...");
    }

    public async sendEmail(email: Email): Promise<void> {
        console.log("Sending email to: ", email.to);
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
}
