this doc governs how the column definition for tanstack table should be implemented. [xxx] is the name of the table.

# xxx-columns-defs.ts

check that the following exists as we require it to define our definitions

```
import { renderComponent, HeaderCell } from '$lib/components/ui/data-table';
```

look inside theTableState to see which columns are hidden by default

## hidden columns

each hidden column should render a header like such

```
header: () => null
```

## columns which are visible

each item inside of the columnDefs array should define a header like such:

```
header: () => renderComponent(HeaderCell, { icon: 'premium', label: 'Premium' }),
```

### sizes

each definition must have a size, minsize and maxsize unless it is hidden
