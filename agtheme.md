

React Data Grid
Theming

react logoReact
Theming refers to the process of adjusting design elements such as colours, borders and spacing to match your applications' design.

We provide a range of methods for customising the appearance of the grid so that you can create any look that your designer can imagine. From the quick and easy to the most advanced, they are:

Select a Built-in Theme as a starting point.
Choose a different Color Scheme if required.
Use Theme Parameters to customise borders, compactness, fonts and more.
Use Theme Parts to change the appearance of components like the icon set and text inputs.
Write your own CSS for unlimited control over grid appearance.
The grid is styled using CSS. It ships with built-in styles that can create a range of designs. You can then use CSS to create more advanced customisations.

Programmatically changing row and cell appearance 
Separately from theming, the grid supports using code to customise the appearance of individual columns, headers or cells by using row styles, cell styles or custom renderers. Unlike theming, these methods allow you to change the appearance of elements depending on the data that they contain.

Legacy Themes 
Before v33, themes were applied by importing CSS files from our NPM packages, see Legacy Themes for more


Built-in themes

react logoReact
Built-in themes provide a starting point for theming your application.

Themes are objects imported from the ag-grid-community package and provided to grid instances using the theme grid option.

import { themeBalham } from 'ag-grid-community';

<AgGridReact
    theme={themeBalham}
    ...
/>
Built-in Themes 
Quartz - Our default theme, with high contrast and generous padding. Will use the IBM Plex Sans font if available⁺.
Balham - A more traditional theme modelled after a spreadsheet application.
Material - A theme designed according to Google's Material v2 design system. This theme looks great for simple applications with lots of white space, and is the obvious choice if the rest of your application uses Material Design. Will use the Google Roboto font if available⁺.
Alpine - The default theme before Quartz. We recommend quartz for new projects; this theme is intended to ease migration to the Theming API for applications already using Alpine.
⁺ You can load these fonts yourself or pass the loadThemeGoogleFonts grid option to load them from Google's CDN. See Customising Fonts for more information.

/***** Code Example ****************************************************/
'use client';
import "ag-grid-enterprise";
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const themes = [
  { id: "themeQuartz", theme: themeQuartz },
  { id: "themeBalham", theme: themeBalham },
  { id: "themeMaterial", theme: themeMaterial },
  { id: "themeAlpine", theme: themeAlpine },
];

const GridExample = () => {
  const [theme, setBaseTheme] = useState(themes[0]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <p style={{ flex: 0 }}>
        Theme:{" "}
        <PartSelector options={themes} value={theme} setValue={setBaseTheme} />
      </p>
      <div style={{ flex: 1 }}>
        <AgGridReact
          theme={theme.theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar
        />
      </div>
    </div>
  );
};

type PartSelectorProps<T extends { id: string } | null> = {
  options: T[];
  value: T;
  setValue: (value: T) => void;
};

const PartSelector = <T extends { id: string; variant?: string } | null>({
  options,
  value,
  setValue,
}: PartSelectorProps<T>) => (
  <select
    onChange={(e) =>
      setValue(options.find((t) => t?.id === e.currentTarget.value)! || null)
    }
    style={{ marginRight: 16 }}
    value={value?.id}
  >
    {options.map((option, i) => (
      <option key={i} value={option?.id}>
        {option?.variant || option?.id || "(unchanged)"}
      </option>
    ))}
  </select>
);

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  editable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 Preview
New Tab
CodeSandbox
Plunker


/*****************************************************************************/

Customising Built-in Themes 
Themes are simply preset configurations of parts and parameters. After choosing a theme as a starting point, you can:

Choose a different Color Scheme if required.
Use Theme Parameters to customise borders, compactness, fonts and more.
Use Theme Parts mix and match elements from different themes, for example the icons from Quartz with the text inputs from Material.
Write your own CSS for unlimited control over grid appearance.





Theme Parameters

react logoReact
Parameters are configuration values that affect the appearance of the grid.

Some parameters such as headerTextColor affect a single aspect of grid appearance. Others have a wider effect, such as spacing which adjusts padding across the whole grid.

Setting Theme Parameters 
To set parameters on a theme, call the theme.withParams(...) method which returns a new theme with different default values for its parameters.

const myTheme = themeQuartz.withParams({
    spacing: 12,
    accentColor: 'red',
});


/************ Code Example *****************************************/
"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridOptions,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  spacing: 12,
  accentColor: "red",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>(
    (() => {
      const rowData: any[] = [];
      for (let i = 0; i < 10; i++) {
        rowData.push({
          make: "Toyota",
          model: "Celica",
          price: 35000 + i * 1000,
        });
        rowData.push({
          make: "Ford",
          model: "Mondeo",
          price: 32000 + i * 1000,
        });
        rowData.push({
          make: "Porsche",
          model: "Boxster",
          price: 72000 + i * 1000,
        });
      }
      return rowData;
    })(),
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


/****************************************************************************/


Under the hood, theme parameters are implemented using CSS custom properties (variables), and withParams() sets default values for these, so you can override them in your application style sheets (see Customising the grid with CSS). However using the API provides validation, typescript autocompletion, and an extended syntax for defining CSS values (see below).

Finding Theme Parameters 
There are many parameters available, and several ways of finding the right one to use:

Theme Builder - In the "All Parameters" section of the Theme Builder you can search for parameters and view documentation.
TypeScript auto-complete - When using an editor with TypeScript language support, you can see all available parameters with inline documentation.
Dev tools - When inspecting an element in the grid, the styles panel shows the CSS custom properties that are being used. A custom property var(--ag-column-border) corresponds to the theme parameter columnBorder.
Parameter Types 
The type of a parameter is determined by the suffix of it name, for example Color, Border or Shadow.

Every type can accept a string, which is passed to CSS without processing so must be valid CSS syntax for the type of parameter, e.g. red is a valid CSS color.

Some parameter types also support an extended syntax. This syntax is only available when using the API to set parameters, when setting parameters with CSS you must always use CSS syntax.

Length Values 
Parameters that refer to on-screen measurements are length values. These will have suffixes like Width, Height, Padding, Spacing etc - in fact, any parameter that does not have one of the more specific suffixes documented below is a length. They can accept any valid CSS length value, including pixels (10px) and variable expressions (var(--myLengthVar)). In addition, the following syntax is supported:

Syntax	Description
4	A number without units is assumed to be pixels
{ ref: 'spacing' }	Use the same value as the spacing parameter
{ calc: '4 * spacing - 2px' }	A CSS calc expression, except that parameter names are allowed and will be converted to the appropriate CSS custom property. This expression would map to the CSS string "calc(4 * var(--ag-spacing) - 2px)". Note that - is a valid character in CSS identifiers, so if you use it for subtraction then spaces are required around it.
Color Values 
All parameters ending "Color" are color values. These can accept any valid CSS color value, including named colors (red), hex values (#FF0000) CSS functions (rgb(255, 0, 0)) and variable expressions (var(--myColorVar)). In addition, the following syntax is supported:

Syntax	Description
{ ref: 'accentColor' }	Use the same value as the accentColor parameter
{ ref: 'accentColor', mix: 0.25 }	A mix of 25%, accentColor 75% transparent
{ ref: 'accentColor', mix: 0.25, onto: 'backgroundColor' }	A mix of 25%, accentColor 75% backgroundColor
Border Values 
All parameters ending "Border" are border values. These can accept any valid CSS border value, such as 1px solid red and variable expressions (var(--myBorderVar)). In addition, the following syntax is supported:

Syntax	Description
{ width: 2, style: 'dashed', color: 'blue' }	An object with 3 optional properties. width can take any length value and defaults to 1. style takes a CSS border-style string and defaults to "solid". color takes any color value and defaults to { ref: 'borderColor' }
true	The default border: {width: 1, style: 'solid' { ref: 'borderColor' }
false	A shorthand for 0
Border Style Values 
All parameters ending "BorderStyle" are border style values. These can accept any valid CSS border-style value, such as dashed, solid and variable expressions (var(--myBorderStyleVar)).

Font Family Values 
All parameters ending "FontFamily" are font family values. These can accept any valid CSS font-family value, such as Arial, sans-serif and variable expressions (var(--myFontFamilyVar)). In addition, the following syntax is supported:

Syntax	Description
{ googleFont: 'IBM Plex Sans' }	A Google font. To prevent potential licensing and privacy implications of accidentally loading Google fonts, you must set the loadThemeGoogleFonts grid option to true. A warning will be logged to the console if this option is unset.
['Arial', 'sans-serif']	An array of fonts. Each item can be a string font name or a { googleFont: "..." } object. The browser will attempt to use the first font and fall back to later fonts if the first one fails to load or is not available on the host system.
Font Weight Values 
All parameters ending "FontWeight" are font weight values. These can accept any valid CSS font-weight value, such as bold, 700 and variable expressions (var(--myFontWeightVar)).

Scale Values 
All parameters ending "Scale" are scale values, which are multiplied by other values to create a final size. They accept a number with optional decimal point. 1 means "no change", 0.5 means "half size", 2 means "double size".

Shadow Values 
All parameters ending "Shadow" are shadow values. These can accept any valid CSS box-shadow value, such as 2px 2px 4px 2px rgba(0, 0, 0, 0.5) and variable expressions (var(--myShadowVar)). In addition, the following syntax is supported:

Syntax	Description
{ offsetX: 2, offsetY: 2, radius: 4, spread: 2, color: 'rgba(0, 0, 0, 0.5)' }	An object with 5 optional properties. offsetX, offsetY, radius and spread take any length value and default to 0. color takes any color value and defaults to { ref: 'foregroundColor' }
Image Values 
All parameters ending "Image" are image values. These can accept any valid CSS image value, such as url('https://example.com/my-image.png') and variable expressions (var(--myImageVar)). In addition, the following syntax is supported:

Syntax	Description
{ url: 'https://example.com/my-image.png' }	Load an image from a URL, or embed a PNG if converted to a data: URL
{ svg: '<svg> ... SVG string ... </svg>' }	Use an SVG source code string
Color Scheme Values 
All parameters ending "ColorScheme" (and there is only one: browserColorScheme) are color scheme values. These can accept any valid CSS color-scheme value, includingdark, light, normal, inherit and variable expressions (var(--myColorScheme)).

Duration Values 
All parameters ending "Duration" are duration values. These can accept any valid CSS time value, such as 1s, 500ms and variable expressions (var(--myAnimationDelayTime)).




Theme Parts

react logoReact
Parts contain the CSS styles for a single feature like icons or text inputs.

Using parts you can, for example, select a text input style that matches you application, or disable our provided text input styles so that you can write your own.

Configuring Theme Parts 
To add a part to a theme, call the theme.withPart(...) method which returns a new theme using that part. A theme can only have one part for a given feature, so for example because all color scheme parts have feature: "colorScheme", adding a new color scheme to a theme will remove any existing part.

import { themeQuartz, colorSchemeDark, iconSetMaterial } from 'ag-grid-community';

// withPart() returns a new theme and calls can be chained
const myTheme = themeQuartz
    .withPart(iconSetMaterial)
    .withPart(colorSchemeDark);
This example demonstrates mixing and matching any built-in theme, icon set, and color scheme:

/************Code example *************************/

import "ag-grid-enterprise";
import React, { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDark,
  colorSchemeDarkBlue,
  colorSchemeDarkWarm,
  colorSchemeLight,
  colorSchemeLightCold,
  colorSchemeLightWarm,
  colorSchemeVariable,
  iconSetAlpine,
  iconSetMaterial,
  iconSetQuartzBold,
  iconSetQuartzLight,
  iconSetQuartzRegular,
  themeAlpine,
  themeBalham,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const baseThemes = [
  { id: "themeQuartz", value: themeQuartz },
  { id: "themeBalham", value: themeBalham },
  { id: "themeAlpine", value: themeAlpine },
];

const colorSchemes = [
  { id: "(unchanged)", value: null },
  { id: "colorSchemeLight", value: colorSchemeLight },
  { id: "colorSchemeLightCold", value: colorSchemeLightCold },
  { id: "colorSchemeLightWarm", value: colorSchemeLightWarm },
  { id: "colorSchemeDark", value: colorSchemeDark },
  { id: "colorSchemeDarkWarm", value: colorSchemeDarkWarm },
  { id: "colorSchemeDarkBlue", value: colorSchemeDarkBlue },
  { id: "colorSchemeVariable", value: colorSchemeVariable },
];

const iconSets = [
  { id: "(unchanged)", value: null },
  { id: "iconSetQuartzLight", value: iconSetQuartzLight },
  { id: "iconSetQuartzRegular", value: iconSetQuartzRegular },
  { id: "iconSetQuartzBold", value: iconSetQuartzBold },
  { id: "iconSetAlpine", value: iconSetAlpine },
  { id: "iconSetMaterial", value: iconSetMaterial },
];

const GridExample = () => {
  const [baseTheme, setBaseTheme] = useState(baseThemes[0]);
  const [colorScheme, setColorScheme] = useState(colorSchemes[0]);
  const [iconSet, setIconSet] = useState(iconSets[0]);

  const theme = useMemo(() => {
    let theme = baseTheme.value;
    if (colorScheme.value) {
      theme = theme.withPart(colorScheme.value);
    }
    if (iconSet.value) {
      theme = theme.withPart(iconSet.value);
    }
    return theme;
  }, [baseTheme, colorScheme, iconSet]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <p style={{ flex: 0 }}>
        Theme:{" "}
        <PartSelector
          options={baseThemes}
          value={baseTheme}
          setValue={setBaseTheme}
        />
        Icons:{" "}
        <PartSelector
          options={iconSets}
          value={iconSet}
          setValue={setIconSet}
        />
        Color scheme:{" "}
        <PartSelector
          options={colorSchemes}
          value={colorScheme}
          setValue={setColorScheme}
        />
      </p>
      <div style={{ flex: 1 }}>
        <AgGridReact
          theme={theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar
        />
      </div>
    </div>
  );
};

type PartSelectorProps<T extends { id: string } | null> = {
  options: T[];
  value: T;
  setValue: (value: T) => void;
};

const PartSelector = <T extends { id: string }>({
  options,
  value,
  setValue,
}: PartSelectorProps<T>) => (
  <select
    onChange={(e) =>
      setValue(options.find((t) => t?.id === e.currentTarget.value)! || null)
    }
    style={{ marginRight: 16 }}
    value={value?.id}
  >
    {options.map((option, i) => (
      <option key={i}>{option.id}</option>
    ))}
  </select>
);

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  editable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


/***************************************************************************************/


Parts Reference 
The following parts are available:

colorScheme feature:
colorSchemeLight - neutral light scheme
colorSchemeLightCold - light scheme with subtle cold tint used by Balham theme
colorSchemeLightWarm - light scheme with subtle warm tint
colorSchemeDark - neutral dark scheme
colorSchemeDarkBlue - our preferred dark scheme used on this website
colorSchemeDarkWarm - dark scheme with subtle warm tint
iconSet feature:
iconSetQuartz - our default icon set
iconSetQuartz({strokeWidth: number}) you can call iconSetQuartz as a function to provide a custom stroke width in pixels (the default is 1.5)
iconSetQuartzLight and iconSetQuartzBold preset lighter and bolder versions of the Quartz icons with 1px and 2px stroke widths respectively.
iconSetMaterial - the Material Design icon set
iconSetAlpine - the icon set used by the Alpine theme
iconSetBalham - the icon set used by the Balham theme
buttonStyle feature:
buttonStyleBase - unstyled buttons with many parameters to configure their appearance
buttonStyleQuartz - buttons styled as per the Quartz theme
buttonStyleAlpine - buttons styled as per the Alpine theme
buttonStyleBalham - buttons styled as per the Balham theme
columnDropStyle feature - controls the styling of column drop zone in the columns tool panel:
columnDropStylePlain - undecorated drop zone as used by Balham and Material themes
columnDropStyleBordered - drop zone with a dashed border around it as used by the Quartz and Alpine themes.
checkboxStyle feature:
checkboxStyleDefault - checkbox style used by our themes. There is only one style provided which is configurable through parameters. It being a part allows you to replace it with your own checkbox styles if desired.
inputStyle feature:
inputStyleBase - unstyled inputs with many parameters to configure their appearance
inputStyleBordered - inputs with a border around them
inputStyleUnderlined - inputs with a line underneath them as used in Material Design
tabStyle feature:
tabStyleBase - unstyled tabs with many parameters to configure their appearance
tabStyleQuartz - tabs styled as per the Quartz theme
tabStyleMaterial - tabs styled as per the Material theme
tabStyleAlpine - tabs styled as per the Alpine theme
tabStyleRolodex - tabs designed to imitate paper cards, as used by the Balham theme
styleMaterial feature (used by the Material theme):
styleMaterial - Adds the primaryColor parameter defined by Material Design v2 and uses this color instead of the accentColor for most colored elements. accentColor is still used for checked checkboxes and to highlight active filters. This part also applies some adjustments to appearance of elements to match the Material Design specification, e.g. making all button text uppercase.
Removing a Part 
To remove a part from a theme, call theme.withoutPart(featureName), which returns a new theme without the specified part:

const myCustomTheme = themeQuartz.withoutPart('checkboxStyle');
After removing the built-in part, this example uses CSS in a separate style sheet to style the checkboxes:


/********Code Example******************************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import "./style.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridOptions,
  GridState,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myCustomTheme = themeQuartz.withoutPart("checkboxStyle");

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>(
    (() => {
      const rowData: any[] = [];
      for (let i = 0; i < 10; i++) {
        rowData.push({
          make: "Toyota",
          model: "Celica",
          price: 35000 + i * 1000,
        });
        rowData.push({
          make: "Ford",
          model: "Mondeo",
          price: 32000 + i * 1000,
        });
        rowData.push({
          make: "Porsche",
          model: "Boxster",
          price: 72000 + i * 1000,
        });
      }
      return rowData;
    })(),
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myCustomTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const initialState = useMemo<GridState>(() => {
    return {
      rowSelection: ["1", "2", "3"],
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow", checkboxes: true };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          initialState={initialState}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


/********************************************************************/


The above example uses an empty part to disable the default checkbox styles and adds its own checkbox styles in the application style sheet. If you want to distribute the checkbox style as a library, you can add the new styles to the part itself, see Distributing Shared Themes & Parts.


Creating Your Own Parts 
For organisations that create a library of reusable styles and share them among many applications, parts can be a convenient way to package up styles and parameters so that each application can use a subset of the whole library.

Single applications that want to change the appearance of the grid do not need to create their own parts, they can simply add CSS rules into the application's style sheets.

The createPart function creates an empty part and takes the following arguments:

import { createPart } from 'ag-grid-community';

const myCheckboxStyle = createPart({
    // By setting the feature, adding this part to a theme will remove the
    // theme's existing checkboxStyle, if any 
    feature: 'checkboxStyle',
    params: {
        // Declare parameters added by the custom CSS and provide default values
        checkboxCheckedGlowColor: { ref: 'accentColor' },
        checkboxGlowColor: { ref: 'foregroundColor', mix: 0.5 },
        // If you want to provide new default values for parameters already defined
        // by the grid, you can do so too
        accentColor: 'red',
    },
    // Add some CSS to this part.
    // If your application is bundled with Vite you can put this in a separate
    // file and import it with `import checkboxCSS from "./checkbox.css?inline"`
    css: `
        .ag-checkbox-input-wrapper {
            border-radius: 4px;
            /* Here we're referencing the checkboxGlowColor parameter in CSS, we need
               to add the --ag- prefix and use kebab-case */
            box-shadow: 0 0 5px 4px var(--ag-checkbox-glow-color);

        ... css implementing the new checkbox style ...
        
        `,
});

Note that the checkboxes in the example below are using the default styles from your web browser, because the parts containing their styles have not been added. This is useful if your application does not contain these features, or if you want a clean base upon which to apply your own checkbox styles.

/*******Code example **************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridOptions,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  colorSchemeVariable,
  createGrid,
  createTheme,
  iconSetMaterial,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myCustomTheme = createTheme()
  // add just the parts you want
  .withPart(iconSetMaterial)
  .withPart(colorSchemeVariable)
  // set default param values
  .withParams({
    accentColor: "red",
    iconSize: 18,
  });

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>(
    (() => {
      const rowData: any[] = [];
      for (let i = 0; i < 10; i++) {
        rowData.push({
          make: "Toyota",
          model: "Celica",
          price: 35000 + i * 1000,
        });
        rowData.push({
          make: "Ford",
          model: "Mondeo",
          price: 32000 + i * 1000,
        });
        rowData.push({
          make: "Porsche",
          model: "Boxster",
          price: 72000 + i * 1000,
        });
      }
      return rowData;
    })(),
  );
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myCustomTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow", checkboxes: true };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>




  /**********************************************/


Naming of parameters in custom parts 
Parameters must use a naming convention based on their type, so for example all color parameters must end with Color. The full list of types and suffixes is on the Parameters page. Any variable without a recognised suffix is considered to be a length.

Using the correct type suffix ensures that values will be interpreted correctly, allowing you to use the extended syntax, e.g. {ref: "accentColor", mix: 0.5} to create a semi-transparent color.

Additionally, the suffix is used by Typescript to infer the correct type for the parameter, ensuring that applications using the part and overriding the default value in their theme will get appropriate type checking.

Multiple Grids 
Each grid on the page can have its own theme. In the example below, 3 themes are used by 4 grids. The bottom two grids share a theme (Balham) and use CSS custom properties to achieve different header colours:


/***********Code Example **********************/
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
  themeBalham,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import "./style.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const GridExample = () => {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <p style={{ flex: 1 }}>Quartz theme:</p>
        <p style={{ flex: 1 }}>Alpine theme:</p>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeQuartz}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeAlpine}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <p style={{ flex: 1 }}>Balham theme (green header):</p>
        <p style={{ flex: 1 }}>Balham theme (red header):</p>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }} className="green-header">
          {
            <AgGridReact
              theme={themeBalham}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
        <div style={{ flex: 1 }} className="red-header">
          {
            <AgGridReact
              theme={themeBalham}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
      </div>
    </div>
  );
};

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  editable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


/*****************************************************************/


Theming: Colors & Dark Mode

react logoReact
Control the overall color scheme and color of individual elements

Overview 
Change individual colour parameters
Switch between light and dark color schemes using parts
Integrate with a website that has a dark mode toggle using theme modes
Make unrestricted customisations using CSS
Color Parameters 
The grid has a few key color parameters that most applications will set custom values for, and many more specific color parameters that can be used for fine tuning. Appropriate default values for many parameters are automatically generated based on the key parameters:

backgroundColor - typically your application page background (must be opaque)
foregroundColor - typically your application text color
accentColor - the color used for highlights and selection; your organisation's primary brand color often works well.
Key colors are mixed together to make default values for all other colors that you can override to fine tune the color scheme. For example, the default border color is generated by mixing the background and foreground colors at a ratio of 85% background to 15% foreground. This can be overridden by setting the borderColor parameter.

Some commonly overridden color parameters are:

borderColor - the color of all borders, see also Customising Borders
chromeBackgroundColor - the background color of the grid's chrome (header, tool panel, etc).
textColor, headerTextColor, cellTextColor - override text colors for UI, for headers and cells respectively
Many more parameters are available, search the "All Parameters" section of the theme builder for a full list.

For example:

const myTheme = themeQuartz.withParams({
    backgroundColor: 'rgb(249, 245, 227)',
    foregroundColor: 'rgb(126, 46, 132)',
    headerTextColor: 'rgb(204, 245, 172)',
    headerBackgroundColor: 'rgb(209, 64, 129)',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: 'rgb(126, 46, 132)',
});




/***************************************************Code Example************************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  backgroundColor: "rgb(249, 245, 227)",
  foregroundColor: "rgb(126, 46, 132)",
  headerTextColor: "rgb(204, 245, 172)",
  headerBackgroundColor: "rgb(209, 64, 129)",
  oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
  headerColumnResizeHandleColor: "rgb(126, 46, 132)",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/*********************************************************************/


Extended Syntax for Color Values 
All theme parameters with the suffix Color are color values, and can accept the following values:

Syntax	Description
string	A CSS color value, such as 'red', 'rgb(255, 0, 0)', or variable expression 'var(--myColorVar)'.
{ ref: 'accentColor' }	Use the same value as the accentColor parameter
{ ref: 'accentColor', mix: 0.25 }	A mix of 25%, accentColor 75% transparent
{ ref: 'accentColor', mix: 0.25, onto: 'backgroundColor' }	A mix of 25%, accentColor 75% backgroundColor
Color Schemes 
The grid defines a number of dark and light color schemes that you can apply.

colorSchemeVariable - the default color scheme for all our built-in themes. By default it appears light, but can be adjusted using theme modes (see below).
colorSchemeLight - a neutral light color scheme
colorSchemeLightWarm, colorSchemeLightCold - light color schemes with subtle warm and cold tints
colorSchemeDark - a neutral dark color scheme
colorSchemeDarkWarm - dark color scheme with subtle warm tint
colorSchemeDarkBlue - blue tinted color scheme as used in dark mode on this website
Color schemes are applied to themes using withPart():

import { colorSchemeDark } from 'ag-grid-community';

const myTheme = themeQuartz.withPart(colorSchemeDark);

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDarkBlue,
  colorSchemeDarkWarm,
  colorSchemeLightCold,
  colorSchemeLightWarm,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const themeLightWarm = themeQuartz.withPart(colorSchemeLightWarm);
const themeLightCold = themeQuartz.withPart(colorSchemeLightCold);
const themeDarkWarm = themeQuartz.withPart(colorSchemeDarkWarm);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkBlue);

const GridExample = () => {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 16 }}>
        <p style={{ flex: 1 }}>colorSchemeLightWarm:</p>
        <p style={{ flex: 1 }}>colorSchemeLightCold:</p>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeLightWarm}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeLightCold}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <p style={{ flex: 1 }}>colorSchemeDarkWarm:</p>
        <p style={{ flex: 1 }}>colorSchemeDarkBlue:</p>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeDarkWarm}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
        <div style={{ flex: 1 }}>
          {
            <AgGridReact
              theme={themeDarkBlue}
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={defaultColDef}
            />
          }
        </div>
      </div>
    </div>
  );
};

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  editable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);






/***************************************/


A color scheme is simply a theme part with values defined for the key color parameters, so if none of the built-in schemes suit, choose the one that is closest to your needs and override parameters as required:

const myTheme = themeQuartz
    .withPart(colorSchemeDarkBlue)
    .withParams({
        // We prefer red to blue. Because the built in color schemes
        // derive all colors from foreground, background and
        // accent colors, changing these two values is sufficient.
        backgroundColor: 'darkred',
        accentColor: 'red',
    });
Theme Modes 
The standard way of changing a grid's appearance after initialisation is to update the value of the theme grid option. You might implement a dark mode toggle by preparing light and dark versions of a theme and switching between them in response to a button press.

Often however, a grid application is embedded within a website, and the website and grid application have different codebases. It may not be easy to update the theme grid option in response to the website's dark mode changing.

For this use case we provide theme modes. When a theme uses the colorSchemeVariable color scheme, which is the default for our built-in themes, the color scheme can be controlled by setting the data-ag-theme-mode="mode" attribute on any parent element of the grid, commonly the html or body elements, where mode is any of:

light
dark
dark-blue
It is also possible to define your own color modes, by passing the mode name to the second parameter of withParams. This example defined custom color schemes for light and dark mode and switches between them by setting the data-ag-theme-mode attribute on the body element:


const myTheme = themeQuartz
    .withParams(
        {
            backgroundColor: '#FFE8E0',
            foregroundColor: '#361008CC',
            browserColorScheme: 'light',
        },
        'light-red'
    )
    .withParams(
        {
            backgroundColor: '#201008',
            foregroundColor: '#FFFFFFCC',
            browserColorScheme: 'dark',
        },
        'dark-red'
    );


    /*********** Code Example ************************/

    import "ag-grid-enterprise";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const theme = themeQuartz
  .withParams(
    {
      backgroundColor: "#FFE8E0",
      foregroundColor: "#361008CC",
      browserColorScheme: "light",
    },
    "light-red",
  )
  .withParams(
    {
      backgroundColor: "#201008",
      foregroundColor: "#FFFFFFCC",
      browserColorScheme: "dark",
    },
    "dark-red",
  );

const GridExample = () => {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <p style={{ flex: 0 }}>
        <label>
          Dark mode:{" "}
          <input
            type="checkbox"
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </label>
      </p>
      <div style={{ flex: 1 }}>
        <AgGridReact
          theme={theme}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          sideBar
        />
      </div>
    </div>
  );
};

function setDarkMode(enabled: boolean) {
  document.body.dataset.agThemeMode = enabled ? "dark-red" : "light-red";
}
setDarkMode(false);

const rowData: any[] = (() => {
  const rowData: any[] = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  filter: true,
  enableValue: true,
  enableRowGroup: true,
  enablePivot: true,
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


/************************************/


Theming: Customising Fonts

react logoReact
Altering typography within the grid

Font Family Parameters 
The grid provides the following Theme Parameters to control fonts:

fontFamily sets a default font for all text in the grid
headerFontFamily optionally overrides the font used in the header
cellFontFamily optionally overrides the font used in the data Cells
const myTheme = themeQuartz.withParams({
    fontFamily: 'serif',
    headerFontFamily: 'Brush Script MT',
    cellFontFamily: 'monospace',
});
To customise specific elements, use CSS rules:

/* Set the subtitles within the columns tool panel in CSS */
.ag-column-drop-title {
    font-family: 'Brush Script MT';
    font-size: 1.5em;
}




/********************************************************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import "./style.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  fontFamily: "serif",
  headerFontFamily: "Brush Script MT",
  cellFontFamily: "monospace",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 Preview
New Tab
CodeSandbox
Plunker

/**************************************************/



Extended Syntax for Font Family Parameters 
Font family parameters can accept the following value types:

Syntax	Description
string	A CSS font-family value, such as 'Arial, sans-serif' or variable expression 'var(--myFontFamilyVar)'.
{ googleFont: 'IBM Plex Sans' }	A Google font. You must load the font or ask the grid to load it for you, see Loading Google Fonts below.
['Arial', 'sans-serif']	An array of fonts. Each item can be a string font name or a { googleFont: "..." } object. The browser will attempt to use the first font and fall back to later fonts if the first one fails to load or is not available on the host system.
Loading Google Fonts 
To prevent potential licensing and privacy implications, the grid will not load Google fonts unless requested to. If your theme uses Google fonts you should either:

set the loadThemeGoogleFonts grid option to true, and the grid will load the font from Google's CDN
load the font yourself using a @font-face rule in your application's CSS
If the font has not been loaded through either of the above methods, the theme will fall back to the most appropriate font available on the system.

This example demonstrates fonts loaded by the grid and by the application's style sheets:

const myTheme = themeQuartz.withParams({
    // the grid will load these fonts for you if loadThemeGoogleFonts=true
    fontFamily: { googleFont: 'Delius' },
    headerFontFamily: { googleFont: 'Sixtyfour Convergence' },
    cellFontFamily: { googleFont: 'Turret Road' },
    // these fonts are awesome, so they should be large too
    fontSize: 20,
    headerFontSize: 25,
});
/* If you use a Google font in CSS and not in theme parameters, you are
   responsible for loading it yourself */
@import url('https://fonts.googleapis.com/css2?family=Kablammo&display=swap');

.ag-column-drop-title {
    font-family: 'Kablammo';
    font-size: 1.5em;
    color: green;
}



/****************************************************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import "./style.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  // the grid will load these fonts for you if loadThemeGoogleFonts=true
  fontFamily: { googleFont: "Delius" },
  headerFontFamily: { googleFont: "Sixtyfour Convergence" },
  cellFontFamily: { googleFont: "Turret Road" },
  // these fonts are awesome, so they should be large too
  fontSize: 20,
  headerFontSize: 25,
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          loadThemeGoogleFonts={true}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);


Theming API: Customising Borders

react logoReact
Control the borders around rows, cells and UI elements.

Borders are controlled using theme parameters ending Border. There are many such parameters, you can find a full list by searching for "border" in the Theme Builder "All Parameters" section.

The most important parameters relating to borders are:

borderColor - sets the default color for all borders, which can be overridden for individual borders using the parameters below
rowBorder and headerRowBorder - sets the horizontal borders between rows in the grid and header
columnBorder and headerColumnBorder - sets the vertical borders between columns in the grid and header
wrapperBorder - sets the border around the grid itself
Example: row borders 
const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: false,
    rowBorder: { style: 'dotted', width: 3, color: '#9696C8' },
    columnBorder: { style: 'dashed', color: '#9696C8' },
});

Theming API: Customising Borders

react logoReact
Control the borders around rows, cells and UI elements.

Borders are controlled using theme parameters ending Border. There are many such parameters, you can find a full list by searching for "border" in the Theme Builder "All Parameters" section.

The most important parameters relating to borders are:

borderColor - sets the default color for all borders, which can be overridden for individual borders using the parameters below
rowBorder and headerRowBorder - sets the horizontal borders between rows in the grid and header
columnBorder and headerColumnBorder - sets the vertical borders between columns in the grid and header
wrapperBorder - sets the border around the grid itself
Example: row borders 
const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: false,
    rowBorder: { style: 'dotted', width: 3, color: '#9696C8' },
    columnBorder: { style: 'dashed', color: '#9696C8' },
});




import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  borderColor: "#9696C8",
  wrapperBorder: false,
  headerRowBorder: false,
  rowBorder: { style: "dotted", width: 3 },
  columnBorder: { style: "dashed" },
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          theme={theme}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/******************************/


Borders between header cells 
Column borders between header cells have adjustable height, and there is also the option of styling the resize handle which is only present on resizable columns. See Customising Headers for more information.



Theming: Compactness & Row Height

react logoReact
Add more white space or pack more data into the UI.

spacing is the main theme parameter that controls how tightly data and UI elements are packed together. All padding in the grid is defined as a multiple of this value, so increasing it will make most components larger by increasing their internal white space while leaving the size of text and icons unchanged.

In the following example, classes are applied to the grid container that change compactness dynamically:

/***************COde*********************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  createGrid,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const changeSize = useCallback((value: number) => {
    document.documentElement.style.setProperty("--ag-spacing", `${value}px`);
    document.getElementById("spacing")!.innerText = value.toFixed(1);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            flex: "none",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          spacing ={" "}
          <span style={{ minWidth: "50px" }}>
            <span id="spacing">8.0</span>px
          </span>
          <input
            type="range"
            onInput={() => changeSize(event.target.valueAsNumber)}
            defaultValue="8"
            min="0"
            max="20"
            step="0.1"
            style={{ width: "200px" }}
          />
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"columns"}
            animateRows={false}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
/****************************/

Row Height 
By default, row height is determined by the content height plus padding. Content height is max(iconSize, dataFontSize). Padding is a multiple of spacing. This means that your rows can change size if you change any of the icon size, font size, or spacing.

The grid provides two ways of customising row height:

rowVerticalPaddingScale and headerVerticalPaddingScale are plain numbers without units. The padding is multiplied by this number, so 0.75 would mean 3/4 of the usual padding. Using these scale parameters preserves the behaviour that row size adjusts when font size changes, which is useful if font size is not known in advance.

rowHeight and headerHeight are CSS length values - numbers with units. They set the height of the row or header to a fixed value, regardless of the font size or icon size.

listItemHeight sets the height of rows in lists such as the rich select editor and set filter.

More Compactness Parameters 
To find compactness parameters relating to a feature, search for the feature name in the "All Parameters" section of the Theme Builder.

Extended Syntax For Length Parameters 
All compactness parameters except rowVerticalPaddingScale and headerVerticalPaddingScale are length parameters - numbers with units like 10px. Length parameters do not have a common suffix - any parameter that does not have a special suffix like Color or FontFamily is a length value.

Length parameters can accept the following values:

Syntax	Description
string	A CSS length value, such as '10px' or variable expression 'var(--myAppHeaderSize)'.
4	A number without units is assumed to be pixels
{ ref: 'spacing' }	Use the same value as the spacing parameter
{ calc: '4 * spacing - 2px' }	A CSS calc expression, except that parameter names are allowed and will be converted to the appropriate CSS custom property. This expression would map to the CSS string "calc(4 * var(--ag-spacing) - 2px)". Note that - is a valid character in CSS identifiers, so if you use it for subtraction then spaces are required around it.
Using CSS rules to customise compactness 
The grid contains thousands of elements. Most of them respond to the spacing parameter, by having their default padding defined as a multiple of it. But many of them don't have their own specific parameters to customise size. For all elements except rows, headers and list items (see note below), you can set their height, margin or paddings using CSS rules that target a class name, e.g.

.ag-panel-title-bar {
    height: 80px;
}
Setting the height of rows, headers and list items 
To change the height of rows, headers and list item heights, you must use the provided parameters rowHeight, headerHeight and listItemHeight, or the equivalent CSS custom properties --ag-row-height, --ag-header-height and --ag-list-item-height. The grid uses DOM virtualisation for rendering large amounts of data, and needs to know the height of virtualised elements in order to calculate their layout. It does this by measuring the values of CSS variables such as --ag-row-height.

Using CSS to set a height on a row element itself e.g. .ag-row { height: 50px; } is not supported.



Theming: Customising Selections

react logoReact
Control how selected rows and cells appear.

Row Selections 
When row selection is enabled, you can set the color of selected rows using the selectedRowBackgroundColor parameter. If your grid uses alternating row colours we recommend setting this to a semi-transparent colour so that the alternating row colours are visible below it.

const myTheme = themeQuartz.withParams({
    /* bright green, 10% opacity */
    selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
});


/*************Code***********************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  /* bright green, 10% opacity */
  selectedRowBackgroundColor: "rgba(0, 255, 0, 0.1)",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: "multiRow" };
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        params.api.setGridOption("rowData", data);
      });
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.forEachNode((node) => {
      if (node.rowIndex === 2 || node.rowIndex === 3 || node.rowIndex === 4) {
        node.setSelected(true);
      }
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          columnDefs={columnDefs}
          theme={theme}
          rowSelection={rowSelection}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/***************************************/


Cell selections can be created by clicking and dragging on the grid. Copying from a selection will briefly highlight the range of cells (Ctrl + C). There are several parameters to control the selection and highlight style:

const myTheme = themeQuartz.withParams({
    // color and style of border around selection
    rangeSelectionBorderColor: 'rgb(193, 0, 97)',
    rangeSelectionBorderStyle: 'dashed',
    // background color of selection - you can use a semi-transparent color
    // and it wil overlay on top of the existing cells
    rangeSelectionBackgroundColor: 'rgb(255, 0, 128, 0.1)',
    // color used to indicate that data has been copied form the cell range
    rangeSelectionHighlightColor: 'rgb(60, 188, 0, 0.3)',
});

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  CellSelectionOptions,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  // color and style of border around selection
  rangeSelectionBorderColor: "rgb(193, 0, 97)",
  rangeSelectionBorderStyle: "dashed",
  // background color of selection - you can use a semi-transparent color
  // and it wil overlay on top of the existing cells
  rangeSelectionBackgroundColor: "rgb(255, 0, 128, 0.1)",
  // color used to indicate that data has been copied form the cell range
  rangeSelectionHighlightColor: "rgb(60, 188, 0, 0.3)",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        setRowData(data);
        params.api.addCellRange({
          rowStartIndex: 1,
          rowEndIndex: 5,
          columns: ["age", "country", "year", "date"],
        });
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/************************/


Theming: Customising Headers

react logoReact
Style grid header cells and column groups.

The grid exposes many theme parameters starting header* for customising header appearance:

const myTheme = themeQuartz.withParams({
    headerHeight: '30px',
    headerTextColor: 'white',
    headerBackgroundColor: 'black',
    headerCellHoverBackgroundColor: 'rgba(80, 40, 140, 0.66)',
    headerCellMovingBackgroundColor: 'rgb(80, 40, 140)',
});
For a full list of relevant parameters, search "header" in the "All Parameters" section of the Theme Builder or use typescript autocompletion in your IDE.

When the theme parameters are not enough you can use CSS classes, in particular ag-header, ag-header-cell, and ag-header-group-cell:

.ag-theme-quartz .ag-header {
    font-family: cursive;
}
.ag-theme-quartz .ag-header-group-cell {
    font-weight: normal;
    font-size: 22px;
}
.ag-theme-quartz .ag-header-cell {
    font-size: 18px;
}

/***********************/
"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  headerHeight: "30px",
  headerTextColor: "white",
  headerBackgroundColor: "black",
  headerCellHoverBackgroundColor: "rgba(80, 40, 140, 0.66)",
  headerCellMovingBackgroundColor: "rgb(80, 40, 140)",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Group 1",
      children: [{ field: "athlete", minWidth: 170 }, { field: "age" }],
    },
    {
      headerName: "Group 2",
      children: [
        { field: "country" },
        { field: "year" },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
/*********************************************/

Header Column Borders and Resize Handles 
Header Column Borders appear between every column, whereas Resize Handles only appear on resizeable columns (Group 1 in the example below).

const myTheme = themeQuartz.withParams({
    headerColumnBorder: { color: 'purple' },
    headerColumnBorderHeight: '80%',

    headerColumnResizeHandleColor: 'orange',
    headerColumnResizeHandleHeight: '25%',
    headerColumnResizeHandleWidth: '5px',
});

/*******************************/


import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  headerColumnBorder: { color: "purple" },
  headerColumnBorderHeight: "80%",
  headerColumnResizeHandleColor: "orange",
  headerColumnResizeHandleHeight: "25%",
  headerColumnResizeHandleWidth: "5px",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Group 1",
      children: [
        { field: "athlete", minWidth: 170, resizable: true },
        { field: "age", resizable: true },
      ],
      resizable: true,
    },
    {
      headerName: "Group 2",
      children: [
        { field: "country" },
        { field: "year" },
        { field: "date" },
        { field: "sport" },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      resizable: false,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/*********************************************/

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  ModuleRegistry,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "age", maxWidth: 120 },
    { field: "country" },
    { field: "year", maxWidth: 120 },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);
  const initialState = useMemo<GridState>(() => {
    return {
      filter: {
        filterModel: {
          country: {
            filterType: "text",
            type: "contains",
            filter: "us",
          },
        },
      },
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          initialState={initialState}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);




Styling the First and Last Columns 
It's possible to style the all first and last column header (Grouped, Non-Grouped and Floating Filters) using CSS by targeting the .ag-column-first and .ag-column-last selectors as follows:

.ag-header-group-cell.ag-column-first {
    background-color: #2244CC66; /* bluest */
}
.ag-header-cell.ag-column-first {
    background-color: #2244CC44; /* bluer */
}
.ag-floating-filter.ag-column-first {
    background-color: #2244CC22; /* blue */
}

.ag-header-group-cell.ag-column-last {
    background-color: #33CC3366; /* greenest */
}
.ag-header-cell.ag-column-last {
    background-color: #33CC3344; /* greener */
}
.ag-floating-filter.ag-column-last {
    background-color: #33CC3322; /* green */
}




Custom Icons

react logoReact
This section details how to provide your own icons for the grid and style grid icons for your application requirements

Swapping the Provided Icon Set 
The grid provides several icon sets as theme parts. You can change the icon set on a theme using theme.withPart(iconSet).

Available icon sets are:

iconSetQuartz - our default icon set
iconSetQuartz({strokeWidth: number}) you can call iconSetQuartz as a function to provide a custom stroke width in pixels (the default is 1.5)
iconSetQuartzLight and iconSetQuartzBold preset lighter and bolder versions of the Quartz icons with 1px and 2px stroke widths respectively.
iconSetAlpine - the icon set used by the Alpine theme
iconSetMaterial - the Material Design icon set (these are designed to be displayed at look best at 18, 24, 36 or 48px)
This example shows the Quartz theme with the Material icon set

import { iconSetMaterial, themeQuartz } from 'ag-grid-community';

const myTheme = themeQuartz
    .withPart(iconSetMaterial)
    // Material icons are designed to look best at 18, 24, 36 or 48px
    .withParams({
        iconSize: 18,
    });


    /************************************/
    import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  Theme,
  ValidationModule,
  createGrid,
  iconSetMaterial,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const myTheme = themeQuartz
  .withPart(iconSetMaterial)
  // Material icons are designed to look best at 18, 24, 36 or 48px
  .withParams({
    iconSize: 18,
  });

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/************************/



Replacing Individual Icons 
The iconOverrides part can be used to change individual icons to an image, solid color with image mask, or icon font character. It can be used multiple times in the same theme to mix different types of icon.

Overriding Icons with Images 
iconOverrides can replace icons with images using the following arguments:

Parameter	Description
type	image
mask	If true, the icon shape is taken from the image and the color from the grid foregroundColor parameter. This allows one icon to serve in both light and dark modes
icons	A map of icon name to images. Values use image parameter syntax to accept image urls or svg source code.
import { themeQuartz, iconOverrides } from 'ag-grid-community';

// create an icon override part
const mySvgIcons = iconOverrides({
    type: 'image',
    mask: true,
    icons: {
      // map of icon names to images
      'filter': { url: 'https://examle.com/my-filter-icon.svg' },
      'group': { svg: '<svg> ... svg source ...</svg>' },
    }
});

// use it in a theme
const myTheme = themeQuartz.withPart(mySvgIcons);
Replacing Icons with Icon Font Characters 
iconOverrides can replace icons with icon font glyphs or emoji using the following arguments:

Parameter	Description
type	font
family	Optional, the name of the icon font family to use
cssImports	Optional, an array CSS file URLs to import, can be used to load the CSS file that defines the icon font
weight	Optional, e.g. bold. Some icon fonts such as fontawesome require a bold font weight.
color	Optional CSS color e.g. red. Can use color parameter syntax to reference and mix other color parameters.
icons	A map of icon name to text data. If you're using an icon font, the correct character for each icon will be documented by your font. But you can use any text or emoji.
import { themeQuartz, iconOverrides } from 'ag-grid-community';

// create an icon override part
const fontAwesomeIcons = iconOverrides({
    type: 'font',
    family: 'Font Awesome 5 Free',
    cssImports: ['https://use.fontawesome.com/releases/v5.6.3/css/all.css'],
    weight: 'bold', // Font Awesome requires bold font weight
    icons: {
        // use font codes documented by Font Awesome e.g. '\u{f062}' == arrow-up
        asc: '\u{f062}',
        desc: '\u{f063}',
    },
})

// use it in a theme
const myTheme = themeQuartz.withPart(fontAwesomeIcons);
Replacing Icons Example 
The following example combines the various ways of overriding icons:

Sorting and grouping icons (coloured green) are replaced with characters from FontAwesome
Group and Aggregation icons (coloured red) are replaced with characters from the Material Design Icons font
The Columns icon (🏛️) is replaced with an emoji
The filter icon is replaced with a blue-colored SVG image
The column menu icon is replaced with an SVG image in mask mode. Although the image is blue, the icon uses the grid foreground color and will change color as appropriate for light or dark mode.



/*******************************/
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  SideBarDef,
  TextEditorModule,
  Theme,
  ValidationModule,
  createGrid,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const myTheme = themeQuartz
  .withPart(
    iconOverrides({
      type: "image",
      icons: {
        filter: {
          url: "https://www.ag-grid.com/example-assets/svg-icons/filter.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "image",
      mask: true,
      icons: {
        "menu-alt": {
          url: "https://www.ag-grid.com/example-assets/svg-icons/menu-alt.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "font",
      icons: {
        columns: "🏛️",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "green",
      icons: {
        asc: "\u{f062}",
        desc: "\u{f063}",
        "tree-closed": "\u{f105}",
        "tree-indeterminate": "\u{f068}",
        "tree-open": "\u{f107}",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: [
        "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.css",
      ],
      type: "font",
      family: "Material Design Icons",
      color: "red",
      icons: {
        group: "\u{F0328}",
        aggregation: "\u{F02C3}",
      },
    }),
  );

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", sort: "asc", rowGroup: true, hide: true },
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Country",
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/**************************/

Styling Icons Using CSS 
If you prefer to style your application using pure CSS, you can still change icons.

.ag-icon-group {
    /* set a new image */
    background: url('https://www.ag-grid.com/example-assets/svg-icons/group.svg');
    /* hide the existing image-mask based icon from the provided theme */
    color: transparent;
}





Set the Icons Through gridOptions (JavaScript) 
You can pass an icons property either on the Grid Options to apply across the whole grid, or the Column Definition. If both are provided, icons specified at the column level will take priority.

The icons property takes an object of name/value pairs where the name is one of the icon names below (note that these are different from the CSS names above) and the value is one of:

An HTML string to be inserted in place of the usual DOM element for an icon
A function that returns either an HTML string or a DOM node


import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SideBarModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SideBarModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const myIcons = {
  sortAscending: () => {
    return "ASC";
  },
  sortDescending: () => {
    return "DESC";
  },
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      rowGroup: true,
      hide: true,
    },
    {
      field: "age",
      width: 90,
      enableValue: true,
      icons: {
        // not very useful, but demonstrates you can just have strings
        sortAscending: "U",
        sortDescending: "D",
      },
    },
    {
      field: "country",
      width: 150,
      rowGroupIndex: 0,
      icons: {
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },
    },
    { field: "year", width: 90, enableRowGroup: true },
    { field: "date" },
    {
      field: "sport",
      width: 110,
      icons: myIcons,
    },
    { field: "gold", width: 100 },
    { field: "silver", width: 100 },
    { field: "bronze", width: 100 },
    { field: "total", width: 100 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 150,
      filter: true,
      floatingFilter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: "Athlete",
      field: "athlete",
      rowDrag: true,
      // use font awesome for first col, with numbers for sort
      icons: {
        menu: '<i class="fa fa-shower"/>',
        menuAlt: '<i class="fa fa-shower"/>',
        filter: '<i class="fa fa-long-arrow-alt-up"/>',
        columns: '<i class="fa fa-snowflake"/>',
        sortAscending: '<i class="fa fa-sort-alpha-up"/>',
        sortDescending: '<i class="fa fa-sort-alpha-down"/>',
      },
      width: 300,
    };
  }, []);
  const icons = useMemo<{
    [key: string]: ((...args: any[]) => any) | string;
  }>(() => {
    return {
      // use font awesome for menu icons
      menu: '<i class="fa fa-bath" style="width: 10px"/>',
      menuAlt: '<i class="fa fa-bath" style="width: 10px"/>',
      filter: '<i class="fa fa-long-arrow-alt-down"/>',
      columns: '<i class="fa fa-handshake"/>',
      sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
      sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
      // use some strings from group
      groupExpanded:
        '<img src="https://www.ag-grid.com/example-assets/group/contract.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
      groupContracted:
        '<img src="https://www.ag-grid.com/example-assets/group/expand.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
      columnMovePin: '<i class="far fa-hand-rock"/>',
      columnMoveAdd: '<i class="fa fa-plus-square"/>',
      columnMoveHide: '<i class="fa fa-times"/>',
      columnMoveMove: '<i class="fa fa-link"/>',
      columnMoveLeft: '<i class="fa fa-arrow-left"/>',
      columnMoveRight: '<i class="fa fa-arrow-right"/>',
      columnMoveGroup: '<i class="fa fa-users"/>',
      rowGroupPanel: '<i class="fa fa-university"/>',
      pivotPanel: '<i class="fa fa-magic"/>',
      valuePanel: '<i class="fa fa-magnet"/>',
      menuPin: "P",
      menuValue: "V",
      menuAddRowGroup: "A",
      menuRemoveRowGroup: "R",
      clipboardCopy: ">>",
      clipboardCut: "<<",
      clipboardPaste: ">>",
      rowDrag: '<i class="fa fa-circle"/>',
      columnDrag: '<i class="fa fa-square"/>',
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={true}
          autoGroupColumnDef={autoGroupColumnDef}
          icons={icons}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);

/*****************/


Theming: Customising Tool Panels

react logoReact
Style the Filters Tool Panel and Columns Tool Panel.

Styling the Sidebar Area 
The sidebar is a tabbed container for opening and switching between tool panels. The grid exposes many theme parameters for customising the sidebar and tabbed buttons. Search "side" in the "All Parameters" section of the Theme Builder or use typescript autocompletion in your IDE.

const myTheme = themeQuartz.withParams({
    sideBarBackgroundColor: '#08f3',
    sideButtonBarBackgroundColor: '#fff6',
    sideButtonBarTopPadding: 20,
    sideButtonSelectedUnderlineColor: 'orange',
    sideButtonTextColor: '#0009',
    sideButtonHoverBackgroundColor: '#fffa',
    sideButtonSelectedBackgroundColor: '#08f1',
    sideButtonHoverTextColor: '#000c',
    sideButtonSelectedTextColor: '#000e',
    sideButtonSelectedBorder: false,
});
To create effects beyond what is possible with theme parameters, use CSS selectors:

.ag-side-button.ag-selected {
    text-shadow: 0 0 8px #039;
    font-weight: 500;
}



import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  sideBarBackgroundColor: "#08f3",
  sideButtonBarBackgroundColor: "#fff6",
  sideButtonBarTopPadding: 20,
  sideButtonSelectedUnderlineColor: "orange",
  sideButtonTextColor: "#0009",
  sideButtonHoverBackgroundColor: "#fffa",
  sideButtonSelectedBackgroundColor: "#08f1",
  sideButtonHoverTextColor: "#000c",
  sideButtonSelectedTextColor: "#000e",
  sideButtonSelectedBorder: false,
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 



Styling the Columns Tool Panel 
The --ag-column-select-indent-size CSS Variable sets the indent of each column group within the columns tool panel. For further customisation, use CSS selectors.

This example demonstrates changing the child indent for grouped columns and the style of the column drop component in the Row Groups area:

const myTheme = themeQuartz.withParams({
    columnSelectIndentSize: 40,
    columnDropCellBackgroundColor: 'purple',
    columnDropCellTextColor: 'white',
    columnDropCellDragHandleColor: 'white',
    columnDropCellBorder: { color: 'yellow', style: 'dashed', width: 2 },
});
.ag-column-drop-cell {
    box-shadow: 0 0 4px purple;
}
/* The different sections within the columns tool panel use
   flex sizing to adapt to vertical space, use min-height
   and max-height to constrain their heights */
.ag-column-drop-vertical-rowgroup {
    min-height: 120px;
}
.ag-column-drop-vertical-aggregation {
    min-height: 90px;
}


import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  columnSelectIndentSize: 40,
  columnDropCellBackgroundColor: "purple",
  columnDropCellTextColor: "white",
  columnDropCellDragHandleColor: "white",
  columnDropCellBorder: { color: "yellow", style: "dashed", width: 2 },
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", minWidth: 170, rowGroup: true },
        { field: "age", rowGroup: true },
        { field: "country" },
      ],
    },
    {
      headerName: "Event",
      children: [{ field: "year" }, { field: "date" }, { field: "sport" }],
    },
    {
      headerName: "Medals",
      children: [
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" },
        { field: "total" },
      ],
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={"columns"}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 


Customising Inputs & Widgets

react logoReact
Style text inputs, checkboxes, toggle buttons and range sliders.

Styling Text Inputs 
The grid exposes many theme parameters beginning input* for customising text input appearance. Search "input" in the "All Parameters" section of the Theme Builder or use typescript autocompletion in your IDE.

const myTheme = themeQuartz.withParams({
    inputBorder: { color: 'orange', style: 'dotted', width: 3 },
    inputBackgroundColor: 'rgb(255, 209, 123)', // light orange
    inputPlaceholderTextColor: 'rgb(155, 101, 1)', // darker orange
    inputIconColor: 'purple', // light orange
});
If there is no parameter for the effect that you want to achieve, you can use CSS selectors:

.ag-text-field-input {
    box-shadow: 0 0 10px orange;
}


import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  inputBorder: { color: "orange", style: "dotted", width: 3 },
  inputBackgroundColor: "rgb(255, 209, 123)",
  inputPlaceholderTextColor: "rgb(155, 101, 1)",
  inputIconColor: "purple", // light orange
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);





Underlined Text Inputs 
The default text input style is inputStyleBordered. The other provided input style is inputStyleUnderlined which produces a Material Design style underlined input. These are theme parts so you can swap them using theme.usePart() or create your own:

const myTheme = themeQuartz.withPart(inputStyleUnderlined);



Creating Your Own Text Input Styles 
If you'd like to create your own input styles from scratch you can remove the existing inputStyle part, see Removing a Part.

Styling Checkboxes 
The grid exposes many theme parameters beginning checkbox* for customising checkbox appearance. Search "checkbox" in the "All Parameters" section of the Theme Builder or use typescript autocompletion in your IDE.

const myTheme = themeQuartz.withParams({
    checkboxUncheckedBackgroundColor: 'yellow',
    checkboxUncheckedBorderColor: 'darkred',
    checkboxCheckedBackgroundColor: 'red',
    checkboxCheckedBorderColor: 'darkred',
    checkboxCheckedShapeColor: 'yellow',
    checkboxCheckedShapeImage: {
        svg: '<svg>... svg source code...</svg>',
    },
    checkboxIndeterminateBorderColor: 'darkred',
});
If there is no parameter for the effect that you want to achieve, you can use CSS selectors:

.ag-checkbox-input-wrapper {
    ... default styles ...
}
.ag-checkbox-input-wrapper.ag-checked {
    ... override default styles for 'checked' state ...
}
.ag-checkbox-input-wrapper.ag-indeterminate {
    ... override default styles for 'indeterminate' state ...
}



import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  checkboxUncheckedBackgroundColor: "yellow",
  checkboxUncheckedBorderColor: "darkred",
  checkboxCheckedBackgroundColor: "red",
  checkboxCheckedBorderColor: "darkred",
  checkboxCheckedShapeColor: "yellow",
  checkboxCheckedShapeImage: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  },
  checkboxIndeterminateBorderColor: "darkred",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", hide: true },
    { field: "age", hide: true },
    { field: "country", hide: true },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 
Changing Checkbox Icons 

Changing Checkbox Icons 
The example above uses checkboxCheckedShapeImage to replace the default check mark with a X symbol. By default, checkboxCheckedShapeImage provides only the shape of the check mark, and the color is replaced using the checkboxCheckedShapeColor parameter.

If you have SVG images containing their own color, this example demonstrates how to create a checkbox style with coloured SVG images. It removes the existing checkbox styles using theme.removePart() and adds new styles with CSS:

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withoutPart("checkboxStyle");

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", hide: true },
    { field: "age", hide: true },
    { field: "country", hide: true },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          sideBar={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);



Styling Toggle Buttons 
Toggle Buttons, such as the "Pivot Mode" toggle in the example below, are styled using theme parameters beginning toggleButton*.

const myTheme = themeQuartz.withParams({
    toggleButtonWidth: 50,
    toggleButtonHeight: 30,
    toggleButtonSwitchInset: 10,
    toggleButtonOffBackgroundColor: 'darkred',
    toggleButtonOnBackgroundColor: 'darkgreen',
    toggleButtonSwitchBackgroundColor: 'yellow',
});


If there is no parameter that achieves the effect you want, you can use CSS selectors:

.ag-toggle-button-input-wrapper {
    ... background styles ...
}
.ag-toggle-button-input-wrapper.ag-checked {
    ... override background styles for 'checked' state ...
}
.ag-toggle-button-input-wrapper::before {
    ... sliding switch styles ...
}
.ag-toggle-button-input-wrapper.ag-checked::before {
    ... override sliding switch styles for 'checked' state ...
}


Theming: Customising Menus & Popups

react logoReact
Style UI elements that float above the main UI, including menus.

Rounding corners 
borderRadius sets the radius of most rectangular elements within the grid, including the grid itself.
wrapperBorderRadius sets the radius of the grid wrapper, if you want it to be different from borderRadius.
Radius on other elements can be set using css selectors, e.g. .ag-menu { border-radius: 2px } will set the radius of popup menus like the right-click context menu.
Drop shadows 
The grid exposes several theme parameters for controlling shadows. Two master parameters control many shadows at once:

popupShadow - a large shadow used on elements that are supposed to appear floating above the grid and separate from it, e.g. drag/drop images and dialogs
cardShadow - a small shadow for for elements that are supposed to appear above the grid but connected to it, like dropdowns and cell editors
And you can override shadows for individual elements using more specific parameters:

menuShadow - Shadow for menus e.g. column menu and right-click context menu
dialogShadow - Shadow for popup dialogs such as integrated charts and the advanced filter builder
cellEditingShadow - Shadow for cells being edited
dragAndDropImageShadow - Shadow for the drag and drop image component element when dragging columns
and more - search "shadow" in the "All Parameters" section of the Theme Builder or use typescript autocompletion in your IDE.
Shadows can use the extended syntax for shadow values:

const myTheme = themeQuartz.withParams({
    menuShadow: { radius: 10, spread: 5, color: 'red' },
});
Styling menus 
In order of preference, these techniques can be used to style menus:

Use the menuBorder, menuSeparatorColor, menuShadow and menuTextColor parameters.
Use CSS rules targeting .ag-menu to provide default styles that apply to all menus - column menus, filter menus and right-click context menus.
Some menus have specific classes, e.g. .ag-column-menu and .ag-filter-menu that can be used to override their styles. Check the browser developer tools to find the menu class.
Sometimes you want to be more specific, for example to style the set filter menu but not other filter menus. For this you can use the CSS :has() selector to select menus containing a specific component, e.g. .ag-menu:has(.ag-set-filter). Use the browser developer tools to find the component class.
Example 
This example combines all of the above techniques to style the context, column and set filter menus. Click on the column menu and filter menu icons in the column header, or right click on the grid to show a context menu:

// Set a blue background and red shadows for all menus
const myTheme = themeQuartz.withParams({
    menuBackgroundColor: 'cornflowerblue',
    menuShadow: { radius: 10, spread: 5, color: 'red' },
});
/* add a green shadow on set filter menus like "Athlete"
   but not other filter menus like "Age" */
.ag-menu:has(.ag-set-filter) {
    box-shadow: 0 0 10px 5px green;
}
/* and a blue shadow on column menus */
.ag-menu.ag-column-menu {
    box-shadow: 0 0 10px 5px blue;
}


import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

// Set a blue background and red shadows for all menus
const myTheme = themeQuartz.withParams({
  menuBackgroundColor: "cornflowerblue",
  menuShadow: { radius: 10, spread: 5, color: "red" },
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 170 },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country" },
    { field: "year", filter: "agNumberColumnFilter" },
    { field: "date", filter: "agDateColumnFilter" },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
 Preview
New Tab
CodeSandbox
Plunker
Theming: Customising Menus & Popups
Rounding corners
Drop shadows
Styling menus
Example
© AG Grid Ltd. 2015-2025

AG Grid Ltd registered in the United Kingdom. Company No. 07318192.

Documentation
Getting Started
Changelog
Pipeline
Documentation Archive



