import { Route, Routes } from "react-router-dom";
import { useData } from "../context/useData";
import { Auth, Home, Exercise} from "../pages";
import { ContentTemplate } from "./content-template";

export const Router = () => {
  const {
    state: { userId, isLoadingUser },
  } = useData();

  return isLoadingUser ? (
    <div>loader</div>
  ) : (
    <Routes>
      {userId ? (
        <Route path="/" element={<ContentTemplate />}>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Exercise />} />
        </Route>
      ) : (
        // ! add redirect maybe
        <Route path="/" element={<Auth />} />
      )}
    </Routes>
  );
};
