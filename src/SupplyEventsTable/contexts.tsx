import { useState, createContext } from "react";
import { SupplyEvent } from "./types";
import { dummyDataSource } from "./dummy-data";

type DataSourceContextType = {
    value: SupplyEvent[],
    setValue: (value: SupplyEvent[]) => void
}

export const DataSourceContext = createContext<DataSourceContextType>({
    value: [],
    setValue: () => {}
})

export const DataSourceContextProvider: React.FC<any> = ({ children }) => {
    const [value, setValue] = useState<SupplyEvent[]>(dummyDataSource)
    console.log(JSON.stringify(value, null, 4))
    return (
        <DataSourceContext.Provider value={{ value, setValue }}>
            {children}
        </DataSourceContext.Provider>
    )
} 
