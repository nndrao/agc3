import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef,
  ModuleRegistry,
  GridOptions,
  ValueFormatterParams,
  CellClassParams,
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { useTheme } from '../context/ThemeContext';
import { DataToolbar } from "./DataToolbar";

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

// Define a type for the tool panel item state changed event
interface ToolPanelItemStateChangedEvent {
  key: string;
  opened: boolean;
}

// Define custom column types
const columnTypes = {
  numberColumn: {
    filter: "agNumberColumnFilter",
    valueFormatter: (params: ValueFormatterParams) => {
      return params.value != null ? params.value.toFixed(2) : "-";
    },
    cellClass: (params: CellClassParams) => {
      if (params.value === null) return "";
      return params.value >= 0 ? "positive-value" : "negative-value";
    },
    headerClass: 'ag-right-aligned-header',
    cellStyle: { textAlign: 'right' }
  },
  currencyColumn: {
    filter: "agNumberColumnFilter",
    valueFormatter: (params: ValueFormatterParams) => {
      return params.value != null ? "$" + params.value.toFixed(2) : "-";
    },
    cellClass: (params: CellClassParams) => {
      if (params.value === null) return "";
      return params.value >= 0 ? "positive-value" : "negative-value";
    },
    headerClass: 'ag-right-aligned-header',
    cellStyle: { textAlign: 'right' }
  },
  percentColumn: {
    filter: "agNumberColumnFilter",
    valueFormatter: (params: ValueFormatterParams) => {
      return params.value != null ? params.value.toFixed(2) + "%" : "-";
    },
    cellClass: (params: CellClassParams) => {
      if (params.value === null) return "";
      return params.value >= 0 ? "positive-value" : "negative-value";
    },
    headerClass: 'ag-right-aligned-header',
    cellStyle: { textAlign: 'right' }
  },
};

interface RowData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export function DataTable() {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { currentTheme, spacing, fontSize, isDarkMode } = useTheme();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const gridApiRef = useRef<GridApi | null>(null);
  
  // Track if sidebar is open
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  // Track which sidebar tool panel is active
  const [activeToolPanel, setActiveToolPanel] = useState<string | undefined>(undefined);

  const containerStyle = useMemo(() => ({ 
    width: "100%", 
    height: "calc(100vh - 7rem)",
    display: "flex",
    flexDirection: "column" as const,
  }), []);

  const gridStyle = useMemo(() => ({ 
    width: '100%',
    flex: 1
  }), []);

  // Define fixed grid options that won't change and cause rerenders
  const gridOptions = useMemo<GridOptions<RowData>>(() => {
    return {
      suppressCellFocus: false,
      rowModelType: "clientSide",
      suppressRowClickSelection: true,
      rowSelection: "multiple",
      enableRangeSelection: true,
      enableCellTextSelection: true,
      pagination: true,
      paginationAutoPageSize: true,
      animateRows: true,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 60,
      },
      // Configure the sidebar with the enhanced tool panels
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: false,
              suppressColumnSelectAll: false,
              suppressColumnExpandAll: false
            }
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            toolPanelParams: {
              suppressFilterSearch: false,
              suppressExpandAll: false
            }
          }
        ],
        defaultToolPanel: activeToolPanel,
        hiddenByDefault: !isSideBarOpen,
        position: 'right'
      },
      // Callbacks for sidebar state changes
      onToolPanelVisibleChanged: () => {
        // Track sidebar open/closed state
        const isVisible = gridApiRef.current?.isSideBarVisible() || false;
        setIsSideBarOpen(isVisible);
        
        // If sidebar is closed, reset active panel
        if (!isVisible) {
          setActiveToolPanel(undefined);
        }
      },
      onToolPanelItemStateChanged: (event: ToolPanelItemStateChangedEvent) => {
        // Track which panel is open when sidebar is open
        if (event.opened) {
          setActiveToolPanel(event.key);
        }
      }
    };
  }, [activeToolPanel, isSideBarOpen]);

  // Handle grid ready event to store API reference
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    
    // Apply theme without spacing parameters
    applyTheme();
    
    // Apply spacing via CSS variables
    updateCssVariables(spacing);
    
    // Force the grid to calculate its dimensions correctly after initialization
    setTimeout(() => {
      if (gridApiRef.current) {
        gridApiRef.current.sizeColumnsToFit();
      }
    }, 100);
  };
  
  // Update CSS variables when spacing changes - this is the only place spacing is handled now
  useEffect(() => {
    // Apply spacing via CSS variables only - for smoother transitions
    updateCssVariables(spacing);
  }, [spacing]);
  
  // Handle other theme changes
  useEffect(() => {
    // Apply non-spacing theme changes
    applyTheme();
  }, [currentTheme.theme, fontSize, isDarkMode]);
  
  // Update CSS variables for spacing - this will be the only spacing mechanism
  const updateCssVariables = (spacingValue: number) => {
    const rowHeight = Math.max(30, spacingValue * 3);
    const headerHeight = Math.max(32, spacingValue * 3);
    
    // Update all spacing-related CSS custom properties
    document.documentElement.style.setProperty("--ag-spacing", `${spacingValue}px`);
    document.documentElement.style.setProperty("--ag-grid-size", `${Math.max(4, spacingValue / 2)}px`);
    document.documentElement.style.setProperty("--ag-cell-horizontal-padding", `${spacingValue}px`);
    document.documentElement.style.setProperty("--ag-row-height", `${rowHeight}px`);
    document.documentElement.style.setProperty("--ag-header-height", `${headerHeight}px`);
    document.documentElement.style.setProperty("--ag-list-item-height", `${Math.max(25, spacingValue * 2.5)}px`);
    document.documentElement.style.setProperty("--ag-cell-horizontal-border", `solid ${Math.max(1, Math.floor(spacingValue / 8))}px var(--ag-border-color)`);
    document.documentElement.style.setProperty("--ag-borders-side-panel", `${Math.max(1, Math.floor(spacingValue / 8))}px solid var(--ag-border-color)`);
    document.documentElement.style.setProperty("--ag-border-radius", `${Math.max(2, spacingValue / 4)}px`);
    document.documentElement.style.setProperty("--ag-tool-panel-horizontal-padding", `${spacingValue}px`);
    document.documentElement.style.setProperty("--ag-side-bar-panel-width", `${200 + spacingValue * 5}px`);
  };

  // Apply theme settings without spacing-related parameters
  const applyTheme = useCallback(() => {
    if (!gridApiRef.current) return;
    
    // Create a theme with appropriate parameters, excluding spacing-specific ones
    const theme = currentTheme.theme.withParams({
      // Only apply non-spacing related parameters
      fontSize: fontSize
    });
    
    // Apply theme via API
    gridApiRef.current.setGridOption('theme', theme);
  }, [currentTheme.theme, fontSize]);

  // Example data
  useEffect(() => {
    // Use local data instead of fetch to simplify debugging
    setRowData([
      { athlete: "Michael Phelps", age: 23, country: "United States", year: 2008, sport: "Swimming", gold: 8, silver: 0, bronze: 0, total: 8 },
      { athlete: "Natalie Coughlin", age: 25, country: "United States", year: 2008, sport: "Swimming", gold: 1, silver: 2, bronze: 3, total: 6 },
      { athlete: "Aleksey Nemov", age: 24, country: "Russia", year: 2000, sport: "Gymnastics", gold: 2, silver: 1, bronze: 3, total: 6 },
      { athlete: "Alicia Coutts", age: 24, country: "Australia", year: 2012, sport: "Swimming", gold: 1, silver: 3, bronze: 1, total: 5 },
      { athlete: "Missy Franklin", age: 17, country: "United States", year: 2012, sport: "Swimming", gold: 4, silver: 0, bronze: 1, total: 5 },
      { athlete: "Ryan Lochte", age: 27, country: "United States", year: 2012, sport: "Swimming", gold: 2, silver: 2, bronze: 1, total: 5 },
      { athlete: "Allison Schmitt", age: 22, country: "United States", year: 2012, sport: "Swimming", gold: 3, silver: 1, bronze: 1, total: 5 },
      { athlete: "Natalie Coughlin", age: 21, country: "United States", year: 2004, sport: "Swimming", gold: 2, silver: 2, bronze: 1, total: 5 }
    ]);
  }, []);

  // Column definitions with proper types
  const columnDefs: ColDef<RowData>[] = [
    { headerName: "Athlete", field: "athlete", filter: true },
    { headerName: "Age", field: "age", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Country", field: "country", filter: true },
    { headerName: "Year", field: "year", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Sport", field: "sport", filter: true },
    { headerName: "Gold", field: "gold", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Silver", field: "silver", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Bronze", field: "bronze", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Total", field: "total", filter: true, width: 100, type: 'numberColumn' }
  ];

  return (
    <div style={containerStyle}>
      <DataToolbar onRefresh={() => {}} onAddNew={() => {}} />
      <div style={gridStyle}>
        <AgGridReact<RowData>
          {...gridOptions}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          columnTypes={columnTypes}
          onGridReady={onGridReady}
          loadThemeGoogleFonts={true}
        />
      </div>
    </div>
  );
}