import { DataProvider } from "./context/context";
import { Router } from "./router";

const App = () => {
  return (
    <DataProvider>
      <Router />
    </DataProvider>
  );
};

export default App;
