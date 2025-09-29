import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteIssue,
  getIdIssue,
  getIssues,
  patchIssue,
  postIssues,
} from "./request";
import type { IReqIssue, IssueFilters } from "./IReqIssues";
import { useEffect, useState } from "react";
import type { AssignedTo, Issue } from "./IResIssues";
import { type StatusType, type PriorityType } from "../../types/enums/enums";
import type { IReqUpdateIssue } from "./IReqIssues";
import { handleApiError } from "../../utils/errorHandler";
import toast from "react-hot-toast";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface EditableIssue extends Omit<Issue, "_id" | "createdBy"> {
  readonly _id: string;
  readonly createdBy: AssignedTo | null;
  isEditing?: boolean;
}

export const useHookIssues = (page: number = 1, filters: IssueFilters = {}) => {
  const [data, setData] = useState<EditableIssue[]>([]);

  const [pagination, setPagination] = useState<any>(null);
  const { mutationPathIssues, mutationDeleteIssues } = useMutationIssues();

  const queryIssues = useQuery({
    queryKey: ["issues", page, filters],
    queryFn: () => getIssues(page, filters),
  });

  useEffect(() => {
    if (queryIssues.data && Array.isArray(queryIssues.data.data)) {
      const formattedData = queryIssues.data.data.map((issue) => ({
        ...issue,
        status: issue.status as StatusType,
        priority: issue.priority as PriorityType,
        isEditing: false,
      }));
      setData(formattedData);
      setPagination(queryIssues.data.pagination);
    }
  }, [queryIssues.data]);

  const handleChange = (
    id: string,
    key: keyof EditableIssue,
    value: any
  ): void => {
    const nextData = [...data];
    const activeItem = nextData.find((item) => item._id === id);
    if (activeItem) {
      (activeItem as any)[key] = value;
      setData(nextData);
    }
  };

  const handleEdit = (id: string): void => {
    setData(
      data.map((item) =>
        item._id === id ? { ...item, isEditing: true } : item
      )
    );
  };

  const handleCancel = (id: string): void => {
    if (queryIssues.data && Array.isArray(queryIssues.data.data)) {
      const originalItem = queryIssues.data.data.find(
        (item) => item._id === id
      );
      if (originalItem) {
        setData(
          data.map((item) =>
            item._id === id ? { ...originalItem, isEditing: false } : item
          )
        );
      }
    }
  };

  const handleSave = (id: string): void => {
    const activeItem = data.find((item) => item._id === id);
    if (activeItem) {
      const updateData: IReqUpdateIssue = {
        title: activeItem.title,
        description: activeItem.description,
        status: activeItem.status as StatusType,
        priority: activeItem.priority as PriorityType,
        assignedTo: activeItem.assignedTo?._id,
      };

      mutationPathIssues.mutate(
        {
          id,
          data: updateData,
        },
        {
          onSuccess: () => {
            queryIssues.refetch();
            setData(
              data.map((item) =>
                item._id === id ? { ...item, isEditing: false } : item
              )
            );
          },
        }
      );
    }
  };

  const handleRemove = (id: string): void => {
    mutationDeleteIssues.mutate(id, {
      onSuccess: () => {
        queryIssues.refetch();
      },
    });
  };

  const handleView = (id: string): void => {
    console.log("Viendo detalles del issue:", id);
  };

  return {
    queryIssues: queryIssues.data,

    data,
    handleChange,
    handleEdit,
    handleCancel,
    handleSave,
    handleRemove,
    handleView,
    pagination,
    isLoading: queryIssues.isLoading,
    error: queryIssues.error,
    refetch: () => queryIssues.refetch(),
  };
};

export const useHookIssue = (id: string) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const queryIssue = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIdIssue(id),
  });
  useEffect(() => {
    if (queryIssue.data?.issue && queryIssue.data.issue) {
      setIssue(queryIssue.data.issue);
    }
  }, [queryIssue.data]);
  return {
    issue,
    queryIssue,
    isLoading: queryIssue.isLoading,
    error: queryIssue.error,
  };
};

export const useMutationIssues = () => {
  const queryClient = useQueryClient();

  const mutationPathIssues = useMutation({
    mutationKey: ["path-issue"],
    mutationFn: ({ id, data }: { id: string; data: IReqUpdateIssue }) =>
      patchIssue(id, data),
    onError: (error: any) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });

  const mutationDeleteIssues = useMutation({
    mutationKey: ["delete-issue"],
    mutationFn: (id: string) => deleteIssue(id),
    onError: (error: any) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
  });

  const mutationPostIssues = useMutation({
    mutationKey: ["post-issue"],
    mutationFn: (data: IReqIssue) => postIssues(data),
    onError: (error: any) => {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Issue creado exitosamente");
    },
  });

  return {
    mutationPathIssues,
    mutationDeleteIssues,
    mutationPostIssues,
  };
};
