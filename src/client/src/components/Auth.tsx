import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@redux/hooks/useAppDispatch";
import { FC, ReactNode, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";

type AuthProps = {
  children: ReactNode;
  fallback?: ReactNode;
  disallowAnonymous?: boolean;
  autoLogin?: boolean;
};

export const Auth: FC<AuthProps> = ({
  children,
  fallback,
  disallowAnonymous = false,
  autoLogin = false,
}) => {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    dispatch(({ auth }) => auth.subscribe({ autoLogin }));
    return () => {
      dispatch(({ auth }) => auth.unsubscribe());
    };
  }, [autoLogin, dispatch]);

  if (!isLoggedIn && loading) {
    return <ProgressBar />;
  }

  if (isLoggedIn && !(disallowAnonymous && user?.isAnonymous)) {
    return <>{children}</>;
  }

  return <>{fallback ?? children}</>;
};
