/**
 * @description Staff login request DTO type
 */
export type StaffLoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    staff: StaffResponseDTO;
};

/**
 * @description Staff response DTO type
 */
export type StaffResponseDTO = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
};
