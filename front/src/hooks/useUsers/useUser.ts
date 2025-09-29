import { useEffect, useState } from "react";
import type { User } from "./IResUser";
import { useQuery } from "@tanstack/react-query";
import { getAllUser } from "./request";

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  useEffect(() => {
    if (queryUser.data) {
      setUsers(queryUser.data);
    }
  }, [queryUser.data]);

  return {
    queryUser,
    data :users,
  }
}
