import { issueApi } from "../../api/api";
import type { IReqIssue, IReqUpdateIssue, IssueFilters } from "./IReqIssues";
import type { IResIssues, IresIssuesFilter, IssueId } from "./IResIssues";


export const postIssues = async(data : IReqIssue)=>{
 try {
    const res = await issueApi.post(`/issues/register`, data);
    return res.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
}
export const getIdIssue = async (id: string): Promise<IssueId> => {
  try {
    const res = await issueApi.get(`/issues/${id}`);
    return res.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};

export const deleteIssue = async (id: string) =>{
  try {
    const res = await issueApi.delete(`/issues/${id}`);
    return res.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};

export const getIssues= async (
  page: number = 1,
  filters: IssueFilters = {}
): Promise<IresIssuesFilter> => {
  try {
    const params = {
      page,
      ...filters,
    };

    const res = await issueApi.get(`/issues/filter`, {
      params,
    });
    return res.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};

export const patchIssue = async (
  id: string,
  data: IReqUpdateIssue
): Promise<IResIssues> => {
  try {
    const res = await issueApi.patch(`/issues/${id}`, data);
    return res.data;
  } catch (error: any) {
    console.log("EL ERROR FUE", error.response.data);
    throw error.response.data;
  }
};
