import { useMutation} from "@tanstack/react-query";
import { Button } from "../Button";
import "./LogoutButton.css";
import { logoutFetch } from "../../api/User";
import { queryClient } from "../../api/queryClient";




export const LogoutButton = () => {
  const logoutMutation = useMutation({
    mutationFn:() => logoutFetch(),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["me"]});
    }
  },
  queryClient
  )


  return (
    <div className="logout-button">
      <Button kind="secondary" onClick={() => {logoutMutation.mutate()}}>Выйти</Button>
    </div>

  );
};
