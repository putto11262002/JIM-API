import { Prisma, PrismaClient } from "@prisma/client";
import ConstraintViolationError from "../utils/errors/conflict.error";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify.config";
import { IAuthService } from "./auth.service";
import AuthenticationError from "../utils/errors/authentication.error";
import _ from "lodash";
import type { PaginatedData } from "../types/paginated-data";
import type { CreateStaffInput, StaffRefreshTokenResult, StaffLoginResult, StaffQuery, Staff, StaffRole, StaffWithoutPassword, UpdateStaffInput, UpdateStaffPasswordInput } from "@jimmodel/shared";
import { InvalidArgumentError } from "../utils/errors/invalid-argument.error";


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
    login: (usernameOrEmail: string, password: string) => Promise<StaffLoginResult>;

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

    /**
     * Refresh the access token and refresh token using the refresh token
     * @param refreshToken 
     * @returns 
     */
    refresh: (refreshToken: string) => Promise<StaffRefreshTokenResult>


    /**
     * Mark staff as logout in the database
     * @param accessToken 
     * @returns 
     */
    logout: (accessToken: string) => Promise<void>;



    /**
     * Update staff first name, last name, role
     */
    updateStaff: (id: string, input: UpdateStaffInput) => Promise<void>

    /**
     * Update staff password
     */
    updateStaffPassword: (id: string, input: UpdateStaffPasswordInput) => Promise<void>
}

@injectable()
class StaffService implements IStaffService {
    @inject(TYPES.PRISMA)
    private readonly prisma!: PrismaClient;

    @inject(TYPES.AUTH_SERVICE)
    private readonly authService!: IAuthService;

    private removeStaffPassword(staff: Staff): StaffWithoutPassword {
        return _.omit(staff, ["password"])
    }

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


        return this.removeStaffPassword(staff)
    }

    public async login(
        usernameOrEmail: string,
        password: string
    ): Promise<StaffLoginResult> {
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
            throw new AuthenticationError("Staff not found");
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

        await this.prisma.staff.update({
            where: {
                id: staff.id,
            },
            data: {
                logout: false
            }
        })

        return {
            accessToken,
            refreshToken,
            staff: this.removeStaffPassword(staff),
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

        return this.removeStaffPassword(staff);
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

        return this.removeStaffPassword(staff);
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

        return this.removeStaffPassword(staff);
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

        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;

        const [staffs, total] = await Promise.all([
            this.prisma.staff.findMany({
                where: _query,
                orderBy: {
                    [query.sortBy ?? Prisma.StaffScalarFieldEnum.updatedAt]:
                        query.sortOrder ?? "desc",
                },
                take: pageSize,
                skip: (page - 1) * pageSize ,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    logout: true
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
            hasNextPage: total > page * pageSize,
            hasPreviousPage: page > 1,
        };
        return paginatedData;
    }

    public async refresh(refreshToken: string): Promise<StaffRefreshTokenResult> {
        const payload = this.authService.verifyRefreshToken(refreshToken)
        const staff = await this.prisma.staff.findUnique({where: {id: payload.id}})
        if (staff == null) {
            throw new AuthenticationError("Invalid refresh token");
        }

        const [accessToken, newRefreshToken] = await Promise.all([
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
            refreshToken: newRefreshToken,
            staff: this.removeStaffPassword(staff)
        };

    }

    public async logout(accessToken: string): Promise<void> {
        let payload;
        try{
            payload = this.authService.verifyAccessToken(accessToken);
        }catch(err){
            return
        }
        await this.prisma.staff.update({where: {id: payload?.id}, data: {logout: true}})
    }

    public async updateStaff(id: string, input: UpdateStaffInput): Promise<void> {
        const updatedStaff = await this.prisma.staff.update({where: {id}, data: input})
        if (updatedStaff === null){
            throw new InvalidArgumentError("invalid staff id")
        }
    }

    public async updateStaffPassword(id: string, input: UpdateStaffPasswordInput): Promise<void> {
        const hashedPassword = await this.authService.hashPassword(input.password)
        const updatedStaff = await this.prisma.staff.update({where: {id}, data: {password: hashedPassword}})
        if(updatedStaff === null){
            throw new InvalidArgumentError("invalid staff id")
        }
    }
}

export default StaffService;
