import { StatusCollectionHalSource, StatusCollectionHalSourceProps } from "@/halSources";
import request from "../request";

export const getStatuses = async (params?: any) => {
  const result: StatusCollectionHalSourceProps = await request.get(`/workbenchApi/api/v3/statuses`, {
    params,
  });
  return new StatusCollectionHalSource(result);
};
