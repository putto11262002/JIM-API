/**
 * @description Staff response DTO type
 */
type StaffResponseDTO = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
};

export default StaffResponseDTO;
