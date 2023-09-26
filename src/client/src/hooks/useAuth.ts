import { useAppSelector } from "@redux/hooks/useAppSelector";

export const useAuth = () => {
  const myProfile = useAppSelector((state) => state.myProfile);
  const action = useAppSelector((state) => state.view.action);

  return {
    ...myProfile,
    isLoggedIn: myProfile.user != null,
    loading: action === "running",
  };
};
