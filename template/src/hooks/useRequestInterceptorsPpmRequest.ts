import { useEffect } from "react";
import { request } from "@/services";

export const useRequestInterceptorsPpmRequest = () => {
  useEffect(() => {
    const useId = request.interceptors.request.use((config) => {
      if (!config.url || !/(\/workbenchApi\/api\/v3)|(^https?:\/\/[^/]+\/workbenchApi\/api\/v3)/.test(config.url)) return config;
      if (config.params) {
        Object.keys(config.params).forEach(key => {
          const value = config.params[key];
          if (typeof value !== 'string') config.params[key] = JSON.stringify(value);
        });
      }
      return config;
    }, error => {
      console.log(error);
      return Promise.reject(error);
    });
    return () => {
      request.interceptors.request.eject(useId);
    };
  }, []);
};
