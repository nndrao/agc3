import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ModuleRegistry, themeQuartz, ColDef, ValueFormatterParams, GridReadyEvent, GridApi } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "../../context/ThemeContext";
import { DataToolbar } from "./DataToolbar";
import { generatePositions, formatPositionValue } from "../../lib/dummyData";
import type { Position } from "../../lib/dummyData";

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Extend GridApi type to include missing methods
interface ExtendedGridApi extends GridApi {
  setRowData: (data: Position[]) => void;
}

// Create dynamic theme that responds to ThemeContext changes
const useDynamicTheme = () => {
  const { fontSize, spacing, accentColor, isDarkMode } = useTheme();
  
  return useMemo(() => {
    return themeQuartz
      .withParams(
        {
          accentColor: accentColor,
          backgroundColor: "#F7F7F7",
          borderColor: "#23202029",
          browserColorScheme: "light",
          buttonBorderRadius: 2,
          cellTextColor: "#000000",
          checkboxBorderRadius: 2,
          columnBorder: true,
          fontFamily: {
            googleFont: "Inter",
          },
          fontSize: fontSize, // Dynamic fontSize from sliders
          headerBackgroundColor: "#EFEFEFD6",
          headerFontFamily: {
            googleFont: "Inter",
          },
          headerFontSize: fontSize, // Match header fontSize to body fontSize
          headerFontWeight: 500,
          iconButtonBorderRadius: 1,
          iconSize: Math.max(12, Math.floor(fontSize * 0.85)),
          inputBorderRadius: 2,
          oddRowBackgroundColor: "#EEF1F1E8",
          spacing: spacing, // Dynamic spacing from sliders
          wrapperBorderRadius: 2,
        },
        "light"
      )
      .withParams(
        {
          accentColor: accentColor,
          backgroundColor: "#1f2836",
          borderRadius: 2,
          checkboxBorderRadius: 2,
          columnBorder: true,
          fontFamily: {
            googleFont: "Inter",
          },
          browserColorScheme: "dark",
          chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor",
          },
          fontSize: fontSize, // Dynamic fontSize from sliders
          foregroundColor: "#FFF",
          headerFontFamily: {
            googleFont: "Inter",
          },
          headerFontSize: fontSize, // Match header fontSize to body fontSize
          iconSize: Math.max(12, Math.floor(fontSize * 0.85)),
          inputBorderRadius: 2,
          oddRowBackgroundColor: "#2A2E35",
          spacing: spacing, // Dynamic spacing from sliders
          wrapperBorderRadius: 2,
        },
        "dark"
      );
  }, [fontSize, spacing, accentColor, isDarkMode]);
};

// Position-specific column definitions
const columnDefs: ColDef<Position>[] = [
  {
    field: "symbol",
    headerName: "Symbol",
    pinned: "left",
    width: 100,
  },
  {
    field: "name",
    headerName: "Name",
    pinned: "left",
    width: 150,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 100,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'number'),
    cellClass: 'ag-right-aligned-cell',
    headerClass: 'ag-right-aligned-header',
  },
  {
    field: "avgPrice",
    headerName: "Avg Price",
    width: 120,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'currency'),
    cellClass: 'ag-right-aligned-cell',
    headerClass: 'ag-right-aligned-header',
  },
  {
    field: "currentPrice",
    headerName: "Current Price",
    width: 120,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'currency'),
    cellClass: 'ag-right-aligned-cell',
    headerClass: 'ag-right-aligned-header',
  },
  {
    field: "marketValue",
    headerName: "Market Value",
    width: 120,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'currency'),
    cellClass: 'ag-right-aligned-cell',
    headerClass: 'ag-right-aligned-header',
  },
  {
    field: "pnl",
    headerName: "PnL",
    width: 120,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'currency'),
    cellClass: (params: ValueFormatterParams) => [
      'ag-right-aligned-cell',
      (params.value as number) >= 0 ? 'ag-cell-positive' : 'ag-cell-negative'
    ],
    headerClass: 'ag-right-aligned-header',
  },
  {
    field: "pnlPercentage",
    headerName: "PnL %",
    width: 100,
    valueFormatter: (params: ValueFormatterParams) => formatPositionValue(params.value as number, 'percentage'),
    cellClass: (params: ValueFormatterParams) => [
      'ag-right-aligned-cell',
      (params.value as number) >= 0 ? 'ag-cell-positive' : 'ag-cell-negative'
    ],
    headerClass: 'ag-right-aligned-header',
  }
];

// Default column definition
const defaultColDef = {
  flex: 1,
  minWidth: 100,
  filter: true,
  floatingFilter: true,
  resizable: true,
  sortable: true,
  enableValue: true,
  enableRowGroup: true,
  enablePivot: true,
};

export function DataTable() {
  const { isDarkMode, spacing } = useTheme();
  const [gridApi, setGridApi] = useState<ExtendedGridApi | null>(null);
  
  // Get the dynamic theme
  const theme = useDynamicTheme();
  
  // Get sample data
  const rowData = generatePositions(100);
  
  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api as ExtendedGridApi);
    
    // Apply initial sizing
    params.api.sizeColumnsToFit();
    
    // Listen for window resize
    const resizeHandler = () => {
      setTimeout(() => params.api.sizeColumnsToFit(), 100);
    };
    window.addEventListener('resize', resizeHandler);
    
    // Listen for theme changes
    const themeChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      
      setTimeout(() => {
        try {
          // Apply row and header heights if provided
          if (detail.rowHeight) {
            params.api.resetRowHeights();
          }
          
          if (detail.headerHeight) {
            // Header height refresh is handled by refreshHeader
          }
          
          // Apply full refresh sequence
          params.api.refreshCells({ force: true });
          params.api.refreshHeader();
          
          // If font size changed or forceRedraw is true, do a more comprehensive redraw
          if (detail.fontSize || detail.spacing || detail.forceRedraw) {
            console.log("Theme change:", detail);
            
            // Apply a full grid redraw with increased timeouts to ensure correct rendering
            setTimeout(() => {
              params.api.resetRowHeights(); 
              params.api.redrawRows();
              params.api.sizeColumnsToFit();
              
              // Add extra redraw for stubborn browsers 
              setTimeout(() => {
                params.api.refreshCells({ force: true });
              }, 50);
            }, 50);
          } else {
            // Standard fit
            params.api.sizeColumnsToFit();
          }
        } catch (error) {
          console.error('Error applying theme changes:', error);
        }
      }, 20);
    };
    document.addEventListener('theme-changed', themeChangeHandler);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('theme-changed', themeChangeHandler);
    };
  }, []);
  
  // Set dark mode
  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);
  
  // Function to set dark mode
  function setDarkMode(enabled: boolean) {
    document.body.dataset.agThemeMode = enabled ? "dark" : "light";
  }
  
  // Handle data refresh
  const handleRefreshData = useCallback(() => {
    if (gridApi) {
      const newData = generatePositions(100);
      gridApi.setRowData(newData);
    }
  }, [gridApi]);
  
  return (
    <div className="flex flex-col w-full h-full">
      <DataToolbar onRefresh={handleRefreshData} />
      
      <div 
        className="ag-theme-quartz w-full h-full" 
        style={{ 
          height: 'calc(100vh - 150px)', 
          width: '100%',
          backgroundColor: isDarkMode ? '#1f2836' : '#F7F7F7',
        }}
      >
        <AgGridReact
          theme={theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowHeight={spacing * 3} // Dynamic row height based on spacing
          headerHeight={spacing * 3} // Dynamic header height based on spacing
          sideBar
          rowSelection="multiple"
          enableCharts
          enableRangeSelection
          animateRows
        />
      </div>
    </div>
  );
} 