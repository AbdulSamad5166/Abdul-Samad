import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import type { User } from "../types/auth";
import { getErrorStatus } from "../utils/getErrorMessage";
import { getToken, removeToken, setToken } from "../utils/tokenStorage";

export const ME_QUERY_KEY = ["me"] as const;

export interface AuthContextValue {
  token: string | null;
  user: User | undefined;
  userError: unknown;
  isAuthenticated: boolean;
  isInitializing: boolean;
  retryUser: () => Promise<void>;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUserQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    const status = getErrorStatus(currentUserQuery.error);

    if (status === 401 || status === 403) {
      removeToken();
      setTokenState(null);
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY, exact: true });
    }
  }, [currentUserQuery.error, queryClient]);

  function login(nextToken: string, user: User): void {
    setToken(nextToken);
    setTokenState(nextToken);
    queryClient.setQueryData(ME_QUERY_KEY, user);
  }

  function logout(): void {
    removeToken();
    setTokenState(null);
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY, exact: true });
    navigate("/login", { replace: true });
  }

  async function retryUser(): Promise<void> {
    await currentUserQuery.refetch();
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: currentUserQuery.data,
      userError: currentUserQuery.error,
      isAuthenticated: Boolean(token),
      isInitializing: Boolean(token) && currentUserQuery.isPending,
      retryUser,
      login,
      logout,
    }),
    [token, currentUserQuery.data, currentUserQuery.error, currentUserQuery.isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
