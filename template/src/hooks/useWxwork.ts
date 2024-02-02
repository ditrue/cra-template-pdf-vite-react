import { useRequest } from "ahooks";
import { getWxworkOrgs, getWxworkOrgUsers, getWxworkUsers } from "@/services";

export const useWxworkOrgs = () => {
  const { data } = useRequest(getWxworkOrgs, {
    cacheKey: 'WxworkOrgs',
    cacheTime: -1,
    staleTime: -1,
    debounceWait: 300,
  });

  return data;
};

export const useWxworkOrgUsers = (orgId: number) => {
  const { data } = useRequest(() => getWxworkOrgUsers(orgId), {
    cacheKey: `WxworkOrg${orgId}Users`,
    cacheTime: -1,
    staleTime: -1,
    debounceWait: 300,
    refreshDeps: [orgId],
  });

  return data;
};

export const useWxworkUsers = () => {
  const { data } = useRequest(getWxworkUsers, {
    cacheKey: `WxworkUsers`,
    cacheTime: -1,
    staleTime: -1,
    debounceWait: 300,
  });

  return data;
};
