[xxx] is the name of the table. [coldDef] is the xxx-columns-defs.ts file

this doc governs how the table-store.ts file should be coded for tanstack table should be implemented.

# xxx-table-store.ts

check that the following exists as we require it to define our definitions

```
import { createPersistedState } from '@/utils/storage.svelte';
import type { TableState } from '@/types/table';
```

## TABLE STATE

the table state must be defined as such

```
export const xxxTableState = createPersistedState<TableState>('table_xxx', {
	columnFilters: [],
	expanded: {},
	pagination: { pageIndex: 0, pageSize: 50 },
	rowSelection: {},
	columnVisibility: {
		xxxId: false,
		xxxIsArchived: false
	}
});
```

for each object in the columnVisibility object  
 find the matching column definition in the xxx-columns-defs.ts.  
 If none is found, delete the object from the columnVisibility.

## createSvelteTable

make sure that the state of the tanstack table instance has the following declared:

```
state: {
    get columnFilters() {
        return xxxTableState.columnFilters;
    },
    get pagination() {
        return xxxTableState.pagination;
    },
    get columnVisibility() {
        return xxxTableState.columnVisibility;
    }
},
```
