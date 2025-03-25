import "ag-grid-enterprise";
import React, { useState, useMemo } from "react";
import {
  ModuleRegistry,
  themeQuartz,
  ClientSideRowModelModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllEnterpriseModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from '../context/ThemeContext';

// Register AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule,
  AllEnterpriseModule
]);

const theme = themeQuartz
  .withParams(
    "light",
  )
  .withParams(
    "dark",
  );

export function DataTable() {
  const { theme: appTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(appTheme === 'dark');
  
  const containerStyle = useMemo(() => ({ 
    width: '100%',
    height: "calc(100vh - 7rem)",
    display: "flex",
    flexDirection: "column" as const
  }), []);

  const gridStyle = useMemo(() => ({ 
    width: '100%',
    flex: 1
  }), []);

  // Example 1 data
  const rowData = useMemo(() => {
    const data: any[] = [];
    for (let i = 0; i < 10; i++) {
      data.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
      data.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
      data.push({
        make: "Porsche",
        model: "Boxster",
        price: 72000 + i * 1000,
      });
    }
    return data;
  }, []);

  const columnDefs = [
    { field: "make", flex: 1 }, 
    { field: "model", flex: 1 }, 
    { field: "price", flex: 1 }
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    document.body.dataset.agThemeMode = enabled ? "dark" : "light";
  };

  // Keep theme in sync with app theme
  React.useEffect(() => {
    setDarkMode(appTheme === 'dark');
  }, [appTheme]);

  return (
    <div style={containerStyle} className="w-full">
      <div style={gridStyle} className="w-full">
        <AgGridReact
          theme={theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar={true}
          className="w-full"
        />
      </div>
    </div>
  );
}