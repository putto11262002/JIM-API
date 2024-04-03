import { StaffUpdateInput, StaffUpdatePasswordInput, StaffWithoutSecrets } from "@jimmodel/shared";
import axiosClient from "../lib/axios";

export class StaffService {
  public static async updateStaffById(
    id: string,
    payload: StaffUpdateInput
  ): Promise<void> {
    await axiosClient.put(`/staffs/${id}`, payload);
  }

  public static async updateStaffPasswordById(
    id: string,
    payload: StaffUpdatePasswordInput
  ): Promise<void> {
    await axiosClient.put(`/staffs/${id}/password`, payload);
  }

  public static async getById({id}: {id: string}){
    const res = await axiosClient.get(`/staffs/${id}`);
    return res.data as StaffWithoutSecrets;
  }
}
