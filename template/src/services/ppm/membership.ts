import { MembershipCollectionHalSource, MembershipCollectionHalSourceProps } from "@/halSources";
import request from "../request";

export const getMemberships = async (params?: any) => {
  const result: MembershipCollectionHalSourceProps = await request.get(`/workbenchApi/api/v3/memberships`, {
    params,
  });
  return new MembershipCollectionHalSource(result);
};
