import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../../inversify.config";
import StaffService, {
    type StaffQuery,
    type CreateStaffInput,
} from "../staff.service";
import type { Staff, StaffWithoutPassword } from "../../types/staff";
import ConstraintViolationError from "../../utils/errors/conflict.error";
import AuthenticationError from "../../utils/errors/authentication.error";
import { StaffRole } from "@prisma/client";

describe("StaffService", () => {
    let container: Container;
    let staffService: StaffService;
    const prismaMock = {
        staff: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };
    const authServiceMock = {
        hashPassword: jest.fn(),
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
        comparePassword: jest.fn(),
    };

    beforeEach(() => {
        container = new Container();
        container.bind(TYPES.PRISMA).toConstantValue(prismaMock);
        container.bind(TYPES.AUTH_SERVICE).toConstantValue(authServiceMock);
        staffService = container.resolve(StaffService);
    });

    const staffInput: CreateStaffInput = {
        firstName: "test",
        lastName: "staff",
        email: "teststaff@example.com",
        username: "teststaff",
        password: "password",
        role: "ADMIN",
    };

    const savedStaff: Staff = {
        ...staffInput,
        id: "uuid",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const hashedPassword = "hashedpassword";

    const staffWithoutPassword: StaffWithoutPassword = {
        id: savedStaff.id,
        email: savedStaff.email,
        username: savedStaff.username,
        firstName: savedStaff.firstName,
        lastName: savedStaff.lastName,
        createdAt: savedStaff.createdAt,
        updatedAt: savedStaff.updatedAt,
        role: savedStaff.role,
    };

    describe("createStaff", () => {
        it("Should hash staff password before saving", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(null);
            authServiceMock.hashPassword.mockResolvedValue(hashedPassword);
            prismaMock.staff.create.mockResolvedValue(savedStaff);

            await staffService.createStaff(staffInput);

            expect(prismaMock.staff.create).toHaveBeenCalledWith({
                data: { ...staffInput, password: hashedPassword },
            });
        });

        it("Should return saved staff without password when staff successfully created", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(null);
            authServiceMock.hashPassword.mockResolvedValue(hashedPassword);
            prismaMock.staff.create.mockResolvedValue(savedStaff);

            const staff = await staffService.createStaff(staffInput);

            expect(staff).toEqual(staffWithoutPassword);
        });

        it("throw a contraint violation error when staff with the same username or email already exist", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(savedStaff);

            await expect(staffService.createStaff(staffInput)).rejects.toThrow(
                ConstraintViolationError
            );
        });
    });

    describe("login", () => {
        const refreshToken = "refreshToken";
        const accessToken = "accessToken";

        it("Should return staff, access token, refresh token, when login successful", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(savedStaff);
            authServiceMock.comparePassword.mockResolvedValue(true);
            authServiceMock.generateAccessToken.mockResolvedValue(accessToken);
            authServiceMock.generateRefreshToken.mockResolvedValue(
                refreshToken
            );

            const result = await staffService.login(
                savedStaff.username,
                staffInput.password
            );

            expect(result).toEqual({
                staff: staffWithoutPassword,
                accessToken,
                refreshToken,
            });
        });

        it("Should throw a authentication error when staff does not exist", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(null);

            await expect(
                staffService.login(savedStaff.username, staffInput.password)
            ).rejects.toThrow(AuthenticationError);
        });

        it("Should throw a authentication error when password or usernmae/email is incorrect", async () => {
            prismaMock.staff.findFirst.mockResolvedValue(savedStaff);

            authServiceMock.comparePassword.mockResolvedValue(false);

            await expect(
                staffService.login(savedStaff.username, staffInput.password)
            ).rejects.toThrow(AuthenticationError);
        });
    });

    describe("getStaffById", () => {
        it("Should return staff without password when staff exists", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(staffWithoutPassword);

            const staff = await staffService.getStaffById(savedStaff.id);

            expect(staff).toEqual(staffWithoutPassword);
        });

        it("Should return null if null if staff does not exist", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(null);

            const staff = await staffService.getStaffById("randomId");

            expect(staff).toBeNull();
        });
    });

    describe("getStaffByUsername", () => {
        it("Should return staff without password when staff exists", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(savedStaff);

            const staff = await staffService.getStaffByUsername(
                savedStaff.username
            );

            expect(staff).toEqual(staffWithoutPassword);
        });

        it("Should return null if null if staff does not exist", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(null);

            const staff =
                await staffService.getStaffByUsername("randomUsername");

            expect(staff).toBeNull();
        });
    });

    describe("getStaffByEmail", () => {
        it("Should return staff without password when staff exists", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(savedStaff);

            const staff = await staffService.getStaffByEmail(savedStaff.email);

            expect(staff).toEqual(staffWithoutPassword);
        });

        it("Should return null if null if staff does not exist", async () => {
            prismaMock.staff.findUnique.mockResolvedValue(null);

            const staff = await staffService.getStaffByEmail("randomEmail");

            expect(staff).toBeNull();
        });
    });

    describe("getStaffs", () => {
        it("Should return paginated stuff without password", async () => {
            const staffQuery: StaffQuery = {
                limit: 2,
                offset: 0,
                q: "query",
                roles: [StaffRole.ADMIN],
                sortBy: "createdAt",
                sortOrder: "asc",
            };

            const staffsToReturn: StaffWithoutPassword[] = [
                {
                    id: "uuid1",
                    email: "teststaff1@example.com",
                    username: "teststaff1",
                    firstName: "test",
                    lastName: "staff1",
                    role: StaffRole.ADMIN,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "uuid2",
                    email: "teststaff2@example.com",
                    username: "teststaff2",
                    firstName: "test",
                    lastName: "staff2",
                    role: StaffRole.ADMIN,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            prismaMock.staff.findMany.mockResolvedValue(staffsToReturn);

            prismaMock.staff.count.mockResolvedValue(2);

            const paginatedStaff = await staffService.getStaffs(staffQuery);

            expect(paginatedStaff.data).toHaveLength(2);
            expect(paginatedStaff.data).toEqual(staffsToReturn);
            expect(paginatedStaff.total).toBe(2);
            expect(paginatedStaff.offset).toBe(0);
            expect(paginatedStaff.limit).toBe(2);

            const where = {
                OR: [
                    {
                        username: {
                            startsWith: staffQuery.q,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            startsWith: staffQuery.q,
                            mode: "insensitive",
                        },
                    },
                    {
                        firstName: {
                            startsWith: staffQuery.q,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastName: {
                            startsWith: staffQuery.q,
                            mode: "insensitive",
                        },
                    },
                ],
                role: {
                    in: staffQuery.roles,
                },
            };

            expect(prismaMock.staff.findMany).toHaveBeenCalledWith({
                where,
                orderBy: {
                    [staffQuery.sortBy as any]: staffQuery.sortOrder,
                },
                take: 2,
                skip: 0,
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
            });

            expect(prismaMock.staff.count).toHaveBeenCalledWith({
                where,
            });
        });
    });
});
