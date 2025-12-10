# TanStack Table Page Component Standards

This document defines the standard structure for SvelteKit pages that display TanStack tables.

## Required Elements

### 1. Filtered Record Count Badge

**ALWAYS** display a badge showing the filtered record count next to the table title.

#### Implementation

```svelte
<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';

  // ... table setup
  const table = getMyTable(data.items);
</script>

<!-- In the table header -->
<div class="flex items-center gap-2">
  <h2 class="text-lg font-semibold">Table Title</h2>
  <Badge variant="secondary" class="text-xs">
    {table.getFilteredRowModel().rows.length} records
  </Badge>
</div>
```

#### Why This Matters

- **User Feedback**: Users immediately see how many records match their filters
- **Performance Indicator**: Shows the table is working when filters are applied
- **Data Awareness**: Helps users understand if their filters are too restrictive or too broad
- **Reactive**: Count updates automatically as filters change

### 2. Standard Page Structure

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import * as Card from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';

  import TableContainer from '$lib/components/table/TableContainer.svelte';
  import MyTable from './components/table-xxx/xxx-table.svelte';
  import MyToolbar from './components/table-xxx/toolbar/xxx-toolbar.svelte';
  import { getMyTable, myTableState } from './stores/xxx-table-store';

  let { data }: { data: PageData } = $props();

  const table = getMyTable(data.items);
  let toolbarRef: MyToolbar | null = $state(null);
</script>

<svelte:head>
  <title>Page Title - ClarityCover Dashboard</title>
</svelte:head>

<!-- Filter Toolbar -->
<MyToolbar
  bind:this={toolbarRef}
  bind:columnFiltersState={myTableState.columnFilters}
/>

<!-- Table Container -->
<TableContainer>
  {#snippet header()}
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Table Title</h2>
        <!-- REQUIRED: Filtered record count badge -->
        <Badge variant="secondary" class="text-xs">
          {table.getFilteredRowModel().rows.length} records
        </Badge>
      </div>
      <Card.Description>Brief description of the table</Card.Description>
    </div>
  {/snippet}

  {#snippet content()}
    <MyTable table={table} paginationState={myTableState.pagination} />
  {/snippet}
</TableContainer>
```

### 3. Multiple Tables / Tabs

When a page has multiple tables (e.g., in tabs), **each table must have its own record count badge**:

```svelte
<Tabs.Root bind:value={activeTab}>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Table 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Table 2</Tabs.Trigger>
  </Tabs.List>

  <!-- Tab 1 -->
  <div class:hidden={activeTab !== 'tab1'}>
    <TableContainer>
      {#snippet header()}
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">Table 1</h2>
          <Badge variant="secondary" class="text-xs">
            {table1.getFilteredRowModel().rows.length} records
          </Badge>
        </div>
      {/snippet}
      <!-- ... -->
    </TableContainer>
  </div>

  <!-- Tab 2 -->
  <div class:hidden={activeTab !== 'tab2'}>
    <TableContainer>
      {#snippet header()}
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">Table 2</h2>
          <Badge variant="secondary" class="text-xs">
            {table2.getFilteredRowModel().rows.length} records
          </Badge>
        </div>
      {/snippet}
      <!-- ... -->
    </TableContainer>
  </div>
</Tabs.Root>
```

## Badge Styling Standards

- **Variant**: Always use `variant="secondary"` for subtle, non-intrusive display
- **Size**: Always use `class="text-xs"` for compact appearance
- **Position**: Place immediately after the title in a flex container with `gap-2`
- **Format**: Always use `"{count} records"` format (e.g., "1,234 records")

## Error Handling

When there's an error loading data, don't show the badge:

```svelte
{#if hasError}
  <Alert.Root variant="destructive">
    <AlertCircle class="h-4 w-4" />
    <Alert.Title>Error loading data</Alert.Title>
    <Alert.Description>
      There was a problem loading the data. Please try refreshing the page.
    </Alert.Description>
  </Alert.Root>
{:else}
  <!-- Table with record count badge -->
{/if}
```

## Example: Complete Implementation

See the policies page for a complete reference implementation:
- **File**: `src/routes/dashboard/policies/+page.svelte`
- **Features**: Dual tables (Policies + Bordereau), each with record count badges
- **Integration**: Works seamlessly with year/month filters

## Related Standards

- [Table Store Setup](./table-store.ts.md) - How to configure the table instance
- [Toolbar Component](./xxx-toolbar.svelte.md) - Filter toolbar patterns
- [Folder Structure](./folder-structure.md) - Where components should live

## Checklist

When creating a new table page:

- [ ] Import `Badge` component from `$lib/components/ui/badge`
- [ ] Add badge next to table title with `{table.getFilteredRowModel().rows.length} records`
- [ ] Use `variant="secondary"` and `class="text-xs"`
- [ ] Wrap title and badge in flex container with `gap-2`
- [ ] Test that count updates when filters change
- [ ] If multiple tables, add badge to each table
- [ ] Ensure badge is NOT shown when there's an error state
