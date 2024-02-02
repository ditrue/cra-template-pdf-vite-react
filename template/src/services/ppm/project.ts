import { ProjectCollectionHalSource, ProjectCollectionHalSourceProps, ProjectHalSource, ProjectHalSourceProps } from "@/halSources";
import request from "../request";

export const getProjects = async (params?: any) => {
  const result: ProjectCollectionHalSourceProps = await request.get('/workbenchApi/api/v3/projects', {
    params,
  });
  return new ProjectCollectionHalSource(result);
};

export const getProject = async (id: number) => {
  const result: ProjectHalSourceProps = await request.get(`/workbenchApi/api/v3/projects/${id}`);
  return new ProjectHalSource(result);
};

export const updateProject = async (id: number, params: any) => {
  const result: ProjectHalSourceProps = await request.patch(`/workbenchApi/api/v3/projects/${id}`, params);
  return new ProjectHalSource(result);
};

type GetProjectProfileByCodeResult = {
  id: number;
  code: string;
  name: string;
  projectId?: number;
  projectName?: string;
}

export const getProjectProfileByCode = async (code: string) => {
  const result: GetProjectProfileByCodeResult = await request.get(`/workbenchApi/api/v3/project_profiles/${code}`);
  return {
    id: result.id,
    code: result.code,
    name: result.name,
    projectId: result.projectId,
    projectName: result.projectName,
  };
};

export type CopyProjectParams = {
  projectCode?: string;
  projectName: string;
  projectTypeId: number;
  docLink?: string;
}

export const copyProject = async (params: CopyProjectParams) => {
  const result: { jobId: string } = await request.post('/workbenchApi/op/projects', params);
  return result.jobId;
};

export const getCopyProjectStatus = async (jobId: string) => {
  const result: { status: string; payload?: { redirect: string; } } = await request.get(`/workbenchApi/op/job_statuses/${jobId}`);
  return {
    success: result.status === 'success',
    redirect: result.payload?.redirect,
  };
};

export const getProjectStagesTimelines = async (projectCode: string) => {
  console.log(projectCode);
  const stages = new Array<API.PROJECT.STAGE.ListItem>(10).fill({
    ID: 1,
    name: '测试商务节点',
    startTime: '2022-10-13',
  });
  stages.forEach((item, index) => item.ID = index + 1);
  const timelines = new Array<API.PROJECT.TIMELINE.ListItem>(10).fill({
    ID: 1,
    name: '测试时间线节点',
    projectID: 11244,
    startTime: 1682499600,
    endTime: 1682503200,
    stageDesc: '',
  });
  timelines.forEach((item, index) => item.ID = index + 1);
  return new Promise<{ stages: API.PROJECT.STAGE.ListItem[]; timelines: API.PROJECT.TIMELINE.ListItem[] }>(res => {
    setTimeout(() => {
      res({
        stages,
        timelines,
      });
    }, 1000);
  });
};
