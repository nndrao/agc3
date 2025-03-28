import React, { useEffect, useState, useCallback } from "react";
import { ModuleRegistry, themeQuartz, ColDef, ValueFormatterParams, GridReadyEvent } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "../../context/ThemeContext";
import { DataToolbar } from "./DataToolbar";
import { generatePositions, formatPositionValue } from "../../lib/dummyData";
import type { Position } from "../../lib/dummyData";

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Create custom theme based on the provided example
const theme = themeQuartz
  .withParams(
    {
      accentColor: "#8AAAA7",
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
      fontSize: 14,
      headerBackgroundColor: "#EFEFEFD6",
      headerFontFamily: {
        googleFont: "Inter",
      },
      headerFontSize: 14,
      headerFontWeight: 500,
      iconButtonBorderRadius: 1,
      iconSize: 12,
      inputBorderRadius: 2,
      oddRowBackgroundColor: "#EEF1F1E8",
      spacing: 6,
      wrapperBorderRadius: 2,
    },
    "light"
  )
  .withParams(
    {
      accentColor: "#8AAAA7",
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
      fontSize: 14,
      foregroundColor: "#FFF",
      headerFontFamily: {
        googleFont: "Inter",
      },
      headerFontSize: 14,
      iconSize: 12,
      inputBorderRadius: 2,
      oddRowBackgroundColor: "#2A2E35",
      spacing: 6,
      wrapperBorderRadius: 2,
    },
    "dark"
  );

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
  const { isDarkMode, fontSize, fontFamily } = useTheme();
  const [gridApi, setGridApi] = useState<any>(null);
  
  // Get sample data
  const rowData = generatePositions(100);
  
  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    
    // Apply initial sizing
    params.api.sizeColumnsToFit();
    
    // Listen for window resize
    const resizeHandler = () => {
      setTimeout(() => params.api.sizeColumnsToFit(), 100);
    };
    window.addEventListener('resize', resizeHandler);
    
    // Listen for theme changes
    const themeChangeHandler = (event: Event) => {
      setTimeout(() => {
        try {
          // Extract details from the event
          const detail = (event as CustomEvent).detail || {};
          
          // Apply row height if provided
          if (detail.rowHeight) {
            params.api.resetRowHeights();
          }
          
          // Full refresh sequence
          params.api.refreshCells({ force: true });
          params.api.refreshHeader();
          params.api.sizeColumnsToFit();
          
          // If forceRedraw is true, do a more complete refresh
          if (detail.forceRedraw) {
            // Allow time for CSS to apply before redrawing rows
            setTimeout(() => {
              params.api.redrawRows();
              params.api.sizeColumnsToFit();
            }, 50);
          }
        } catch (error) {
          console.error('Error applying theme changes:', error);
          // Fallback to a simpler refresh if something goes wrong
          params.api.redrawRows();
        }
      }, 50);
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
  
  // Apply custom font styling
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .ag-theme-quartz,
      .ag-theme-quartz-dark {
        --ag-font-family: ${fontFamily};
        font-family: ${fontFamily};
        --ag-font-size: ${fontSize}px;
        font-size: ${fontSize}px;
      }
      
      .ag-theme-quartz .ag-header-cell,
      .ag-theme-quartz-dark .ag-header-cell {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
      }
      
      .ag-theme-quartz .ag-cell,
      .ag-theme-quartz-dark .ag-cell {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
      }
      
      .ag-right-aligned-cell {
        text-align: right;
      }
      
      .ag-right-aligned-header {
        text-align: right;
      }
      
      .ag-cell-positive {
        color: #00FFBA;
        background-color: rgba(0, 255, 186, 0.1);
      }
      
      .ag-cell-negative {
        color: #FF3B3B;
        background-color: rgba(255, 59, 59, 0.1);
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [fontSize, fontFamily]);
  
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