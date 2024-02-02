import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { request } from "@/services";

export const useRequestInterceptorsResponse = () => {
  const navigate = useNavigate();

  const { message } = App.useApp();

  useEffect(() => {
    const useId = request.interceptors.response.use(
      res => {
        const uri = new URL(res.request.responseURL);
        if (/^\/workbenchApi\//.test(uri.pathname) && !/^\/workbenchApi\/api\/v3/.test(uri.pathname)) {
          if (res.data.code !== 0) {
            const msg = res.data.msg || '未知错误';
            message.error(msg);
            return Promise.reject(msg);
          }
          return res.data.data;
        }
        if (/^\/workbenchApi\/api\/v3/.test(uri.pathname)) {
          if (res.data && res.data._type && /^error$/i.test(res.data._type)) {
            message.error(res.data.message);
            return Promise.reject(res.data.message);
          }
        }
        return res.data;
      },
      error => {
        if (error.response.status === 401) {
          navigate('/auth/jwt');
        } else {
          const data = error.response.data;
          const text = data?.message || data?.msg || error.message;
          message.error(text);
        }
        return Promise.reject(error); 
      }
    );
    return () => {
      request.interceptors.response.eject(useId);
    };
  }, [message, navigate]);
};
