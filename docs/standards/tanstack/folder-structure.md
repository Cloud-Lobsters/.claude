---
argument-hint: "[route-path] [table-name]"
---

the route which you should refactor is dashboard/#1 and the table-name is #2 this is only to be applied to tables which are using tanstack table otherwise quit.

## Folder Structure

**IMPORTANT:** Always wrap each table in its own folder inside `components/`, prefixed with `table-`. All files and folders must use kebab-case naming.

```
|-- stores/
|   |-- {table-name}-table-store.ts      # Store file (e.g., claims-table-store.ts, active-policies-table-store.ts)
|-- components/
|   |-- table-{table-name}/              # Folder prefixed with "table-" (e.g., table-claims/, table-active-policies/)
|   |   |-- {table-name}-table.svelte            # Main table component (TanStack Table)
|   |   |-- {table-name}-column-defs.ts          # Column definitions and configuration (kebab-case)
|   |   |
|   |   |-- cells/                         # Individual cell renderer components
|   |   |   |-- {cell-type-1}-cell.svelte       # All cell files in kebab-case
|   |   |   |-- {cell-type-2}-cell.svelte
|   |   |   |-- {cell-type-3}-cell.svelte
|   |   |   `-- ...
|   |   |
|   |   `-- toolbar/                       # Toolbar components (search, filters, actions)
|   |       |-- {table-name}-toolbar.svelte      # All toolbar files in kebab-case
|   |       |-- {filter-1}-filter.svelte # use -filter for component that filter data
|   |       |-- {filter-2}.-action.svelte # use -action for component that do stuff
|   |       `-- ...
|
```

**Store Location:** The store file must be in the `stores/` folder at the route root, NOT inside components or table folders

**Examples:**

- Claims table: `components/table-claims/claims-table.svelte`
- Claims store: `stores/claims-table-store.ts`
- Claims column defs: `components/table-claims/claims-column-defs.ts`
- Active policies table: `components/table-active-policies/active-policies-table.svelte`
- Active policies store: `stores/active-policies-table-store.ts`
- Active policies column defs: `components/table-active-policies/active-policies-column-defs.ts`

## Orphaned files

- Remove any files, folder or component from the table-{table-name} recursively that are not used or referenced anywhere in the project.

- Look for any fitler or actions inside of the /toolbar folder that are not referenced by the toolbar inside the folder

## Shared components

- If a filter or action is referenced by another toolbar but not the one in the ./ then it is a shared components and MUST be moved to

```
$lib/components/table/toolbar
```

- If a filter, action, or cell is used not only in this table but referenced by another table, including toolbar, then it also must be moved to the \$lib

## Barrel file

Each folder should have a barrel file
