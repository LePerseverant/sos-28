import EditableTable from "./EditableTable";
import { DataSourceContextProvider } from "./contexts";
import "./App.css";

function App() {
  return (
    <div className="app">
       <DataSourceContextProvider>
      <EditableTable />
      </DataSourceContextProvider>
    </div>
  );
}

export default App;
