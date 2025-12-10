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

apply the standards set out in /.claude/docs/standards/tanstack/folder-structure.md

## Cleanup

Remove any files, folder or component from the table-{table-name} recursively that are not used or referenced anywhere in the project.

## Barrel file

Each folder should have a barrel file

# APPLY THE FILE STANDARDS

now check that the tanstack table has been applied by running it against

apply the standards set out in /.claude/docs/standards/tanstack/columns-defs.ts.md  
apply the standards set out in /.claude/docs/standards/tanstack/table-store.ts.md  
apply the standards set out in /.claude/docs/standards/tanstack/table-svelte.md

## borderaux tool bar

YOU REFACTOR THE TOOLBAR ACCORING TO SO apply the standards set out in /.claude/docs/standards/tanstack/xxx-toolbar.svelte.md
