import type StaffResponseDTO from "./staff-response.dto";

type StaffLoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    staff: StaffResponseDTO;
};

export default StaffLoginResponseDTO;
