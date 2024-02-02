import { WorkPackageCollectionHalSource, WorkPackageCollectionHalSourceProps } from "@/halSources";
import request from "../request";

export const getWorkPackages = async (params?: any) => {
  const result: WorkPackageCollectionHalSourceProps = await request.get(`/workbenchApi/api/v3/work_packages`, {
    params,
  });
  return new WorkPackageCollectionHalSource(result);
};
