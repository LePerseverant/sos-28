import EditableTable from "./SupplyEventsTable/EditableTable";
import { DataSourceContextProvider } from "./SupplyEventsTable/contexts";
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
