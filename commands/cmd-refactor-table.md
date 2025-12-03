---
argument-hint: "[route-path] [table-name]"
---

the route which you should refactor is dashboard/#1 and the table-name is #2

this is only to be applied to tables which are using tanstack table otherwise quit.

## Command Arguments

When running this command, you MUST provide:

1. **Route path**: The path to the route containing the table #1
2. **Table name** (if multiple tables exist in the route): Which table to refactor (e.g., `claims`, `active-policies`)

**Example usage:**

- Single table route: `/cmd-refactor-table src/routes/dashboard/claims`
- Multiple tables route: `/cmd-refactor-table src/routes/dashboard/policies active-policies`

## Execution Instructions

**IMPORTANT:** Before making ANY file changes:

1. Navigate to the specified route path
2. Identify if there are multiple tables in the route
   - If multiple tables exist and no table name was provided, ask the user which table to refactor
3. Analyze the current table structure for the specified/selected table
4. Verify the table uses TanStack Table (otherwise quit)
5. Identify all files that need to be moved/renamed
6. Present a detailed refactoring plan to the user showing:
   - Current structure (what exists now)
   - Proposed structure (what it will become)
   - List of all file moves/renames
   - Any import path updates needed
7. Wait for user approval before proceeding
8. Only after approval, execute the refactoring

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

## Cleanup

Remove any files, folder or component from the table-{table-name} recursively that are not used or referenced anywhere in the project.

## Barrel file

Each folder should have a barrel file

# APPLY THE FILE STANDARDS

now check that the tanstack table has been applied by running it against

apply the standards set out in /.claude/docs/standards/tanstack/columns-defs.ts.md  
apply the standards set out in /.claude/docs/standards/tanstack/table-store.ts.md  
apply the standards set out in /.claude/docs/standards/tanstack/table-svelte.md
