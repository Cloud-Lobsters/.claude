[xxx] is the name of the table. [coldDef] is the xxx-columns-defs.ts file

this doc governs how the table-store.ts file should be coded for tanstack table should be implemented.

# CSS

the table layout should be table-auto

# Components

the table element should be shadcn component imported in this manner

```
import * as Table from '$lib/components/ui/table';
```

and used as such

```
<Table.Root>
		<Table.Header class="bg-accent">
```
