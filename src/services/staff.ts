import type { PrismaClient, Staff } from "@prisma/client";
import { type CreateStaffInput } from "../types/staff";
import { type StaffServiceContext } from "../types/context";
import InvalidArgumentError from "../utils/errors/conflict-error";
import bcrypt from "bcrypt";
export interface IStaffService {
    /**
     * Check if the staff with the username or email already exists. If not, create a new staff.
     * @param input Staff defails
     * @returns The created staff
     */
    createStaff: (input: CreateStaffInput) => Promise<Staff>;
}

class StaffService implements IStaffService {
    private readonly prisma: PrismaClient;
    constructor(ctx: StaffServiceContext) {
        this.prisma = ctx.prisma;
    }

    public async createStaff(input: CreateStaffInput): Promise<Staff> {
        const staffExist = await this.prisma.staff.findFirst({
            where: {
                OR: [
                    {
                        email: input.email,
                    },
                    {
                        username: input.username,
                    },
                ],
            },
        });

        if (staffExist !== null) {
            throw new InvalidArgumentError("Staff already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(input.password, salt);
        input.password = hashedPassword;

        const staff = await this.prisma.staff.create({
            data: input,
        });

        return staff;
    }
}

export default StaffService;
