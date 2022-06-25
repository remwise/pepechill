import { Outlet } from "react-router-dom";
import { useData } from "../context/useData";

export const ContentTemplate = () => {
  const { logout, sendData } = useData();

  return (
    <div>
      <input type="button" value="ВЫХОД" onClick={logout} />
      <input
        type="file"
        name="file"
        id="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          console.log("file :>> ", file);
          sendData(file);
        }}
      />
      <Outlet />
    </div>
  );
};
