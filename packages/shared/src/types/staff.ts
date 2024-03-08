import  { Staff as _Staff, StaffRole as _StaffRole } from "@prisma/client";

/**
 * @description Payload used to create staff
 */
export type CreateStaffInput = {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: StaffRole;
};

/**
 * @description Payload used to update staff details
 */
export type UpdateStaffInput = {
    firstName: string
    lastName: string
    role: StaffRole
}

/**
 * @description Payloaf used to update staff password
 */
export type UpdateStaffPasswordInput = {
    password: string
}

/** 
* @field accessToken Access token
* @field refreshToken Refresh token
* @field staff Staff details without password
*/
export type StaffLoginResult = {
   accessToken: string;
   refreshToken: string;
   staff: StaffWithoutPassword;
};


/**
 * @description Payload returned when the tokens are refreshed
 */
export type StaffRefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
    staff: StaffWithoutPassword;
}

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
 * @description Staff's roles
 */
export const StaffRole = _StaffRole 

export type StaffRole = _StaffRole


/**
 * @description Staff
 */
export type Staff = _Staff;


/**
 * @description Staff without password
 */
export type StaffWithoutPassword = Omit<Staff, "password">;
