import type StaffResponseDTO from "../../types/dtos/staff-response.dto";
import type { Staff, StaffWithoutPassword } from "../../types/staff";

/**
 * maps domain staff object to staff response DTO object
 * @param staff staff domain object
 * @returns staff response DTO object, see {@link StaffResponseDTO}
 */
export function mapStaffToResponse(
    staff: Staff | StaffWithoutPassword
): StaffResponseDTO {
    return {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        username: staff.username,
        role: staff.role,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
    };
}
