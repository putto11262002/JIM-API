import { PrismaClient } from "@prisma/client";
import type { Staff } from "@prisma/client";
import { type CreateStaffInput } from "../types/staff";
import InvalidArgumentError from "../utils/errors/conflict-error";
import bcrypt from "bcrypt";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify.config";

export interface IStaffService {
    /**
     * Check if the staff with the username or email already exists. If not, create a new staff.
     * @param input Staff defails
     * @returns The created staff
     */
    createStaff: (input: CreateStaffInput) => Promise<Staff>;
}

@injectable()
class StaffService implements IStaffService {
    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

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
