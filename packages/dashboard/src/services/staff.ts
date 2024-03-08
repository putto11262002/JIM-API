import { UpdateStaffInput, UpdateStaffPasswordInput } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

export class StaffService {
  public static async updateStaffById(
    id: string,
    payload: UpdateStaffInput
  ): Promise<void> {
    await axiosClient.put(`/staffs/${id}`, payload);
  }

  public static async updateStaffPasswordById(
    id: string,
    payload: UpdateStaffPasswordInput
  ): Promise<void> {
    await axiosClient.put(`/staffs/${id}/password`, payload);
  }
}
