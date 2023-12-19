import { Prisma, PrismaClient } from "@prisma/client";
import type { StaffRole, StaffWithoutPassword } from "../types/staff";
import ConstraintViolationError from "../utils/errors/conflict.error";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify.config";
import { IAuthService } from "./auth.service";
import AuthenticationError from "../utils/errors/authentication.error";
import _ from "lodash";
import type { PaginatedData } from "../types/paginated-data";

export type CreateStaffInput = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: StaffRole;
};

/**
 * @field accessToken Access token
 * @field refreshToken Refresh token
 * @field staff Staff details without password
 */
export type LoginResult = {
    accessToken: string;
    refreshToken: string;
    staff: StaffWithoutPassword;
};

/**
 * @field q Search query for username, email, first name, last name
 * @field roles Filter by roles
 * @field sortBy Sort by field
 * @field sortOrder Sort order
 * @field limit Limit the number of results
 * @field offset Offset the results
 */
export type StaffQuery = {
    q?: string;
    roles?: string[];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    pageSize?: number;
};

/**
 * @field data list of Staff details without password
 * @field offset Offset the results
 * @field limit Limit the number of results
 * @field total Total number of staff that matched the query
 */
export type StaffResult = {
    data: StaffWithoutPassword[];
    offset: number;
    limit: number;
    total: number;
};

export interface IStaffService {
    /**
     * Check if the staff with the username or email already exists. If not, create a new staff.
     * @param input staff details
     * @returns The created staff
     */
    createStaff: (input: CreateStaffInput) => Promise<StaffWithoutPassword>;

    /**
     * @param usernameOrEmail username or email of the staff
     * @param password
     * @returns accessToken, refreshToken, and staff details, see {@link LoginResult}
     */
    login: (usernameOrEmail: string, password: string) => Promise<LoginResult>;

    /**
     *
     * @param id
     * @returns if found, return the staff details, otherwise null
     */
    getStaffById: (id: string) => Promise<StaffWithoutPassword | null>;

    /**
     *
     * @param email
     * @returns if found, return the staff details, otherwise null
     */
    getStaffByEmail: (email: string) => Promise<StaffWithoutPassword | null>;

    /**
     *
     * @param username
     * @returns if found, return the staff details, otherwise null
     */
    getStaffByUsername: (
        username: string
    ) => Promise<StaffWithoutPassword | null>;

    /**
     * @param query see {@link StaffQuery}
     * @returns list staffs that matched the query. See {@link StaffResult}
     */
    getStaffs: (
        query: StaffQuery
    ) => Promise<PaginatedData<StaffWithoutPassword>>;
}

@injectable()
class StaffService implements IStaffService {
    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

    @inject(TYPES.AUTH_SERVICE)
    private readonly authService!: IAuthService;

    public async createStaff(
        input: CreateStaffInput
    ): Promise<StaffWithoutPassword> {
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
            throw new ConstraintViolationError("staff already exists");
        }

        const hashedPassword = await this.authService.hashPassword(
            input.password
        );
        input.password = hashedPassword;

        const staff = await this.prisma.staff.create({
            data: input,
        });

        const returnedStaff: StaffWithoutPassword = {
            id: staff.id,
            email: staff.email,
            username: staff.username,
            firstName: staff.firstName,
            lastName: staff.lastName,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            role: staff.role,
        };

        return returnedStaff;
    }

    public async login(
        usernameOrEmail: string,
        password: string
    ): Promise<LoginResult> {
        const staff = await this.prisma.staff.findFirst({
            where: {
                OR: [
                    {
                        email: usernameOrEmail,
                    },
                    {
                        username: usernameOrEmail,
                    },
                ],
            },
        });

        if (staff === null) {
            throw new AuthenticationError("StaffWithoutPassword not found");
        }

        const isPasswordValid = await this.authService.comparePassword(
            password,
            staff.password
        );

        if (!isPasswordValid) {
            throw new AuthenticationError("Invalid password or email/username");
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.authService.generateAccessToken({
                id: staff.id,
                role: staff.role,
            }),
            this.authService.generateRefreshToken({
                id: staff.id,
                role: staff.role,
            }),
        ]);

        return {
            accessToken,
            refreshToken,
            staff: _.omit(staff, ["password"]),
        };
    }

    public async getStaffById(
        id: string
    ): Promise<StaffWithoutPassword | null> {
        const staff = await this.prisma.staff.findUnique({
            where: {
                id,
            },
        });

        if (staff === null) {
            return staff;
        }

        return _.omit(staff, ["password"]);
    }

    public async getStaffByEmail(
        email: string
    ): Promise<StaffWithoutPassword | null> {
        const staff = await this.prisma.staff.findUnique({
            where: {
                email,
            },
        });

        if (staff === null) {
            return staff;
        }

        return _.omit(staff, ["password"]);
    }

    public async getStaffByUsername(
        username: string
    ): Promise<StaffWithoutPassword | null> {
        const staff = await this.prisma.staff.findUnique({
            where: {
                username,
            },
        });

        if (staff === null) {
            return staff;
        }

        return _.omit(staff, ["password"]);
    }

    public async getStaffs(
        query: StaffQuery
    ): Promise<PaginatedData<StaffWithoutPassword>> {
        const _query: Prisma.StaffWhereInput = {};
        if (query.q != null) {
            _query.OR = [
                {
                    username: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
                {
                    firstName: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        startsWith: query.q,
                        mode: "insensitive",
                    },
                },
            ];
        }

        if (query.roles != null && query.roles.length > 0) {
            _query.role = {
                in: query.roles as StaffRole[],
            };
        }

        const page = query.page ?? 10;
        const pageSize = query.pageSize ?? 10;

        const [staffs, total] = await Promise.all([
            this.prisma.staff.findMany({
                where: _query,
                orderBy: {
                    [query.sortBy ?? Prisma.StaffScalarFieldEnum.updatedAt]:
                        query.sortOrder ?? "asc",
                },
                take: pageSize,
                skip: ((page ?? 1) - 1) * (pageSize ?? 10),
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.staff.count({
                where: _query,
            }),
        ]);

        const paginatedData: PaginatedData<StaffWithoutPassword> = {
            data: staffs,
            total,
            totalPage: Math.ceil(total / pageSize),
            page,
            pageSize,
            hasNextPage: total < pageSize * pageSize,
            hasPreviousPage: page > 1,
        };
        return paginatedData;
    }
}

export default StaffService;
