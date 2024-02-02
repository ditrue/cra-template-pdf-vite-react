import { TypeCollectionHalSource, TypeCollectionHalSourceProps } from "@/halSources";
import request from "../request";

export const getTypes = async (params?: any) => {
  const result: TypeCollectionHalSourceProps = await request.get(`/workbenchApi/api/v3/types`, {
    params,
  });
  return new TypeCollectionHalSource(result);
};
