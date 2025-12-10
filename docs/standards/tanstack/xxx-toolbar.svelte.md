# Toolbar Standards for TanStack Tables

This document provides comprehensive guidance for creating toolbar components with TanStack Table implementations. `[xxx]` represents the table name (e.g., `claims`, `policies`, `retailers`).

---

## Overview

**Purpose**: Toolbars provide user interface controls for filtering, searching, and performing actions on table data.

**Types of Toolbars**:

1. **Table Toolbars** - MUST use TableFilterManager (see requirements below)
2. **Detail/Standalone Toolbars** - Independent toolbars for detail pages or non-table views (may skip TableFilterManager)

**Core Requirement**:

🔴 **ALL table toolbars MUST use TableFilterManager**. If a table toolbar doesn't have TableFilterManager, the table needs to be refactored to add it.

**When to Use Base Toolbar Component**:

- ✅ For any table with filtering, searching, or bulk actions
- ✅ When you need consistent layout and responsive behavior
- ✅ MUST pass TableFilterManager instance to Toolbar component
- ❌ Skip for simple button groups that don't need filter management (detail pages only)

---

## File Structure & Naming

### Folder Organization

```
routes/dashboard/{feature}/components/table-{table-name}/
└── toolbar/
    ├── {table-name}-toolbar.svelte     # Main toolbar component
    ├── {filter-name}-filter.svelte     # Filter components
    ├── {action-name}-action.svelte     # Action components
    └── index.ts                         # Barrel exports
```

### Naming Conventions

- **Main toolbar**: `{table-name}-toolbar.svelte` (e.g., `claims-toolbar.svelte`)
- **Filters**: `{filter-name}-filter.svelte` (e.g., `status-filter.svelte`, `year-filter.svelte`)
- **Actions**: `{action-name}-action.svelte` (e.g., `export-csv-action.svelte`, `export-qr-action.svelte`)
- **All kebab-case** - No PascalCase or camelCase

---

## Toolbar Architecture Pattern

### Standard Table Toolbar (REQUIRED - with TableFilterManager)

**This is the ONLY pattern for table toolbars.**

**When to use**:

- All table toolbars MUST use this pattern
- Works for ALL filter types (badges, dropdowns, date ranges, multi-select, etc.)
- FlexSearch integration for fast client-side search
- Standard filter chips with clear buttons
- Every filter receives `filterManager` and `clearButton`

**Complete Example**:

```ts
<script lang="ts">
	import type { ColumnFiltersState } from '@tanstack/table-core';
	import { TableFilterManager } from '$lib/utils/table-filters.svelte';
	import Toolbar from '$lib/components/table/toolbar/Toolbar.svelte';
	import { claimSearch } from '../../../stores/claims-table-store';
	import StatusFilter from './status-filter.svelte';
	import TypeFilter from './type-filter.svelte';
	import ArchiveFilter from './archive-filter.svelte';

	interface Props {
		columnFiltersState?: ColumnFiltersState;
	}

	let { columnFiltersState = $bindable([]) }: Props = $props();

	// Initialize filter manager with reactive state and FlexSearch config
	const filterManager = new TableFilterManager(
		() => columnFiltersState,        // Reactive getter
		(v) => (columnFiltersState = v), // Setter
		undefined,                        // Global filter getter (optional)
		undefined,                        // Global filter setter (optional)
		{
			searchInstance: claimSearch,  // FlexSearch instance
			filterColumnId: 'claimId'     // Column ID for search results
		}
	);
</script>

<Toolbar
	{filterManager}
	searchPlaceholder="Search claims..."
	route="/dashboard/claims"
	{columnFiltersState}
>
	{#snippet filters(clearButton)}
		<StatusFilter {clearButton} {filterManager} />

		<div class="h-8 w-px bg-border"></div>

		<TypeFilter {clearButton} {filterManager} />

		<div class="h-8 w-px bg-border"></div>

		<ArchiveFilter {filterManager} />
	{/snippet}
</Toolbar>
```

### ~~Pattern B: Custom Filter Logic~~ ❌ DEPRECATED

**⚠️ THIS PATTERN IS NO LONGER ALLOWED ⚠️**

**Why it's deprecated**:
- ❌ Filter components didn't receive `filterManager`
- ❌ Used callback-based state management instead of centralized filtering
- ❌ Inconsistent with standard filter pattern
- ❌ Made filters harder to maintain and test

**What to do instead**:

✅ **ALL filters MUST receive `filterManager`** and use `filterManager.setFilter()` / `filterManager.clearFilter()` methods directly.

**For complex filters (date ranges, multi-select, etc.)**:
- ✅ STILL pass `filterManager` to the filter component
- ✅ Filter component manages its own UI state internally
- ✅ Filter component calls `filterManager.setFilter()` and `filterManager.clearFilter()` directly
- ✅ No callbacks needed - filter handles its own logic

**Complete Example** (Date Range with FilterManager):

```ts
// year-filter.svelte (CORRECT PATTERN)
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ButtonGroup } from '$lib/components/ui/button-group';
	import type { TableFilterManager } from '$lib/utils/table-filters.svelte';

	interface Props {
		filterManager: TableFilterManager;  // ✅ REQUIRED
		clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
		years: number[];
		yearCounts: Record<string, number>;
	}

	let { filterManager, clearButton, years, yearCounts }: Props = $props();

	// Filter manages its own UI state
	let selectedYear = $state(new Date().getFullYear().toString());

	// Filter updates filterManager directly
	function handleYearSelect(year: string) {
		selectedYear = year;
		filterManager.setFilter('year', year);
	}
</script>

<ButtonGroup orientation="horizontal" class="cursor-pointer">
	{#each years as year}
		{@const yearStr = year.toString()}
		{@const hasData = yearCounts[yearStr] > 0}
		{@const isSelected = selectedYear === yearStr}
		<Button
			variant="outline"
			size="sm"
			disabled={!hasData}
			class={isSelected ? 'bg-emerald-100 text-emerald-700 border-emerald-400' : ''}
			onclick={() => handleYearSelect(yearStr)}
		>
			{year}
		</Button>
	{/each}

	{@render clearButton(
		() => {
			selectedYear = new Date().getFullYear().toString();
			filterManager.clearFilter('year');
		},
		!selectedYear
	)}
</ButtonGroup>
```

**Migration from old Pattern B**:

```diff
// ❌ OLD (Pattern B - Deprecated)
<YearFilter
-	{selectedYear}
-	onYearSelect={handleYearSelect}
/>

// ✅ NEW (Pattern A - Required)
<YearFilter
+	{filterManager}
+	{clearButton}
	{yearCounts}
/>
```

**Key Principles**:
- ✅ Every filter component receives `filterManager`
- ✅ Every filter component receives `clearButton` snippet
- ✅ Filter components manage their own internal UI state
- ✅ Filter components call `filterManager.setFilter()` / `clearFilter()` directly
- ❌ No callback props for state changes
- ❌ No parent-managed selected values

---

## Component Interface Contracts

### Filter Component Interface

**ALL filters MUST follow this standard interface**:

```typescript
interface FilterProps {
	clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
	filterManager: TableFilterManager;
	// Optional: domain-specific COMPUTED values (NOT raw data arrays)
	// Example: statusCounts?: Record<string, number>;
}
```

**Requirements**:

- ✅ **MUST** receive `clearButton` snippet
- ✅ **MUST** receive `filterManager`
- ✅ **MAY** receive computed values (counts, aggregates)
- ✅ **MAY** manage internal UI state using `$state()`
- ✅ **MUST** call `filterManager.setFilter()` / `clearFilter()` directly
- ❌ **MUST NOT** receive callback props (onValueChange, onSelect, etc.)
- ❌ **MUST NOT** receive selected values as props
- ❌ **MUST NOT** receive raw data arrays
- ❌ **MUST NOT** receive `table` instance

**Examples**:

**Simple Badge Filter**:
```typescript
// Uses filterManager.toggleFilter() for simple selections
interface StatusFilterProps {
	clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
	filterManager: TableFilterManager;
}
```

**Complex Filter (Date Range, Multi-Select)**:
```typescript
// Uses filterManager.setFilter() for complex values
// Manages own UI state internally
interface YearFilterProps {
	clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
	filterManager: TableFilterManager;
	yearCounts: Record<string, number>; // Computed in toolbar
}
```

### Action Component Interface

```typescript
interface ActionProps {
  // No clearButton snippet
  disabled: boolean;
  onclick?: () => void;
  // Optional: computed metadata
  count?: number;
  hasData?: boolean;
}
```

**Requirements**:

- ❌ **MUST NOT** receive `clearButton` snippet
- ✅ **MUST** receive `disabled` state
- ✅ **MAY** receive computed values or counts
- ❌ **SHOULD NOT** receive table instance or raw data arrays
- ✅ **MAY** manage internal loading/processing state

---

## TableFilterManager

### Basic Initialization

```typescript
const filterManager = new TableFilterManager(
  () => columnFiltersState, // Reactive getter
  (v) => (columnFiltersState = v), // Setter
  undefined, // Global filter getter (optional)
  undefined, // Global filter setter (optional)
  {
    searchInstance: flexSearchInstance, // FlexSearch instance
    filterColumnId: "primaryKeyField", // Column for search results
  }
);
```

### NEVER Pass `undefined`

❌ **Do NOT pass `filterManager={undefined}` to the Toolbar component.**

This is only acceptable for **non-table detail pages**. For any toolbar used with a TanStack Table:

1. ✅ ALWAYS create a TableFilterManager instance
2. ✅ If you need custom filtering logic, override the `handleFilter` method on TableFilterManager
3. ✅ If you need date range selection, add it as a custom filter type to TableFilterManager

**If you find yourself wanting to pass `filterManager={undefined}` for a table:**

- Stop and refactor to use TableFilterManager properly
- Add custom filter handling to TableFilterManager if needed
- Contact team if you have a complex filtering scenario

### Custom handleSearch Override

For hierarchical search (parent-child relationships):

```typescript
filterManager.handleSearch = (query: string): number => {
  return filterManager.handleHierarchicalSearch(
    query,
    parentSearchInstance, // FlexSearch for parents
    childSearchInstance, // FlexSearch for children
    childToParentMap // Map child IDs to parent IDs
  );
};
```

---

## State Management Patterns

### Local UI State (\$state)

Use `$state()` for **UI-only** state that doesn't affect data:

```typescript
// Toggle states
let isAllExpanded = $state(false);
let showModal = $state(false);

// Loading/processing states
let isExporting = $state(false);
let isProcessing = $state(false);

// Selection state (for custom filters)
let selectedYear = $state(currentYear.toString());
let selectedMonths = $state<string[]>([currentMonth.toString()]);
```

### Simple Derived Values (\$derived)

Use `$derived` for simple computations:

```typescript
// Selection checks
const hasSelectedRows = $derived(table.getSelectedRowModel().rows.length > 0);

// Count calculations
const selectedCount = $derived(Object.entries(table.getState().rowSelection).length);

// Aggregations
const yearCounts = $derived(calculateYearCounts(claims));
```

### Complex Derived (\$derived.by)

Use `$derived.by()` for complex logic to avoid reactive loops:

```typescript
const hasDataToExport = $derived.by(() => {
  const dateFilter = columnFiltersState.find((f) => f.id === "createdAt");
  if (!dateFilter) return false;

  const { start, end } = dateFilter.value as { start: Date; end: Date };
  const startTime = +start;
  const endTime = +end;

  // Check data directly, don't access table.getFilteredRowModel()
  return data.some((item) => {
    const time = new Date(item.createdAt).getTime();
    return time >= startTime && time <= endTime;
  });
});
```

**Why**: Accessing `table.getFilteredRowModel()` inside `$derived` can cause reactive loops. Check source data directly instead.

### Bindable Props

**ALWAYS** use `$bindable()` for `columnFiltersState`:

```typescript
interface Props {
  columnFiltersState?: ColumnFiltersState;
}

let { columnFiltersState = $bindable([]) } = $props();
```

---

## Filter Component Examples

### Simple Badge Filter (toggleFilter)

```ts
<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { CLAIM_STATUS_KEYS, CLAIM_STATUS_CONFIG } from '$lib/options';
	import type { Snippet } from 'svelte';
	import type { TableFilterManager } from '$lib/utils/table-filters.svelte';

	interface Props {
		clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
		filterManager: TableFilterManager;
	}

	let { clearButton, filterManager }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each CLAIM_STATUS_KEYS as status (status)}
		{@const config = CLAIM_STATUS_CONFIG[status]}
		{@const isStatusSelected = filterManager.isSelected('claimStatus', status)}
		<Badge
			variant={isStatusSelected ? config.badgeVariant : 'outline'}
			class="cursor-pointer gap-1 transition-all"
			onclick={() => filterManager.toggleFilter('claimStatus', status)}
		>
			<config.icon class="h-3 w-3" />
			{config.label}
		</Badge>
	{/each}

	{@render clearButton(
		() => filterManager.clearFilter('claimStatus'),
		filterManager.getFilterValues('claimStatus').length === 0
	)}
</div>
```

### Complex Filter (setFilter with internal state)

```ts
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ButtonGroup } from '$lib/components/ui/button-group';
	import type { Snippet } from 'svelte';
	import type { TableFilterManager } from '$lib/utils/table-filters.svelte';

	interface Props {
		clearButton: Snippet<[onclick: () => void, disabled: boolean]>;
		filterManager: TableFilterManager;
		years: number[];
		yearCounts: Record<string, number>;
	}

	let { clearButton, filterManager, years, yearCounts }: Props = $props();

	// Filter manages its own UI state
	let selectedYear = $state(new Date().getFullYear().toString());

	function handleYearSelect(year: string) {
		selectedYear = year;
		// Filter updates filterManager directly
		filterManager.setFilter('year', year);
	}
</script>

<ButtonGroup orientation="horizontal" class="cursor-pointer">
	{#each years as year}
		{@const yearStr = year.toString()}
		{@const hasData = yearCounts[yearStr] > 0}
		{@const isSelected = selectedYear === yearStr}
		<Button
			variant="outline"
			size="sm"
			disabled={!hasData}
			class={isSelected ? 'bg-emerald-100 text-emerald-700 border-emerald-400' : ''}
			onclick={() => handleYearSelect(yearStr)}
		>
			{year}
		</Button>
	{/each}

	{@render clearButton(
		() => {
			selectedYear = new Date().getFullYear().toString();
			filterManager.clearFilter('year');
		},
		!selectedYear
	)}
</ButtonGroup>
```

---

## Action Component Examples

### Export Action with Loading State

```ts
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Download } from '@lucide/svelte';
	import type { ClaimListView } from '@prisma/client';
	import type { ColumnFiltersState } from '@tanstack/table-core';
	import { toast } from 'svelte-sonner';
	import { generateExport } from '$lib/utils/export';

	interface Props {
		claims: ClaimListView[];
		columnFiltersState: ColumnFiltersState;
		hasDataToExport: boolean;
	}

	let { claims, columnFiltersState, hasDataToExport }: Props = $props();

	let isExporting = $state(false);

	const handleExport = async () => {
		const dateFilter = columnFiltersState.find(f => f.id === 'claimCreatedAt');
		if (!dateFilter) {
			toast.error('Please select a date range');
			return;
		}

		isExporting = true;
		try {
			const { start, end } = dateFilter.value as { start: Date; end: Date };
			const filtered = claims.filter(/* filter logic */);
			await generateExport(filtered, { start, end });
			toast.success('Export successful');
		} catch (error) {
			toast.error('Export failed');
		} finally {
			isExporting = false;
		}
	};
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="ghost"
			size="sm"
			class="h-8 gap-2"
			disabled={!hasDataToExport}
			onclick={handleExport}
		>
			<Download size={14} class={isExporting ? 'animate-bounce' : ''} />
			<span class="text-xs">{isExporting ? 'Exporting...' : 'Export'}</span>
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Export to Excel</p>
	</Tooltip.Content>
</Tooltip.Root>
```

---

## Anti-Patterns (What to Avoid)

### ❌ Prop Drilling Raw Data Arrays

**Bad**:

```ts
<!-- Toolbar passes entire arrays -->
<ExportCsvAction {claims} {policies} />

<!-- Child component recalculates -->
const hasData = $derived.by(() => {
  return claims.some(c => matchesFilter(c));
});
```

**Good**:

```ts
<!-- Toolbar computes derived value ONCE -->
const hasDataToExport = $derived.by(() => {
  return claims.some(c => matchesFilter(c));
});

<!-- Pass computed value -->
<ExportCsvAction {hasDataToExport} count={filteredCount} />
```

### ❌ Receiving Table Instance in Filters

**Bad**:

```typescript
interface Props {
  table: Table<T>; // ❌ Filter shouldn't need this
  filterManager: TableFilterManager;
}
```

**Good**:

```typescript
interface Props {
  clearButton: Snippet; // ✅ For UI consistency
  filterManager: TableFilterManager; // ✅ For filter logic
}
```

### ❌ Using Callbacks Instead of FilterManager

**Bad**:

```ts
<!-- Parent defines callbacks -->
<script>
	function handleYearSelect(year: string) {
		selectedYear = year;
		filterManager.setFilter('year', year);
	}
</script>
<YearFilter {selectedYear} onYearSelect={handleYearSelect} />
```

**Good**:

```ts
<!-- Parent passes filterManager, child manages itself -->
<script>
	const filterManager = new TableFilterManager(...);
</script>
<YearFilter {filterManager} {clearButton} {yearCounts} />

<!-- Inside YearFilter: manages own state, calls filterManager directly -->
```

### ❌ Computing Derived Values Multiple Times

**Bad**:

```ts
<!-- Parent computes -->
<script>
	const yearCounts = $derived(calculateYearCounts(claims));
</script>

<!-- Child recomputes same thing -->
<YearFilter {claims} />
<!-- Inside YearFilter: const counts = $derived(calculateYearCounts(claims)) -->
```

**Good**:

```ts
<!-- Compute ONCE in parent -->
<script>
	const yearCounts = $derived(calculateYearCounts(claims));
</script>

<!-- Pass computed value -->
<YearFilter {yearCounts} />
```

---

## Visual Patterns

### Separator Dividers

Use between filter groups for visual clarity:

```ts
<StatusFilter {clearButton} {filterManager} />

<div class="h-8 w-px bg-border"></div>

<TypeFilter {clearButton} {filterManager} />
```

### Responsive Layout

The base Toolbar component handles responsive wrapping automatically:

```ts
<Toolbar {filterManager} {columnFiltersState}>
	{#snippet filters(clearButton)}
		<!-- Filters wrap with gap-x-4 gap-y-3 -->
		<StatusFilter {clearButton} {filterManager} />
		<TypeFilter {clearButton} {filterManager} />
	{/snippet}

	{#snippet actions()}
		<!-- Actions stay on right side -->
		<ExportButton />
	{/snippet}
</Toolbar>
```

---

## Checklist for New Toolbars

Before committing a new toolbar:

- [ ] **FOR TABLE TOOLBARS ONLY**: File name follows pattern: `{table-name}-toolbar.svelte`
- [ ] Uses base Toolbar component from `$lib/components/table/toolbar/`
- [ ] Defines clear Props interface with TypeScript
- [ ] Uses `$bindable()` for `columnFiltersState`
- [ ] **REQUIRED**: Creates TableFilterManager instance with FlexSearch
- [ ] **REQUIRED**: Passes `{filterManager}` to Toolbar component
- [ ] **FORBIDDEN**: Does NOT pass `filterManager={undefined}`
- [ ] Filters separated into own components with `-filter.svelte` suffix
- [ ] Actions separated into own components with `-action.svelte` suffix
- [ ] Filter components receive `clearButton` snippet
- [ ] Action components are self-contained without `clearButton`
- [ ] No raw data arrays passed to child components
- [ ] Derived values computed once in toolbar (not in children)
- [ ] Visual separators (`<div class="h-8 w-px bg-border"></div>`) between filter groups
- [ ] Barrel file (`index.ts`) exports all toolbar components
- [ ] FlexSearch instance created and configured
- [ ] TableFilterManager properly initialized with getter/setter callbacks

---

## Related Files

**Base Components**:

- `src/lib/components/table/toolbar/Toolbar.svelte` - Base toolbar component
- `src/lib/utils/table-filters.svelte.ts` - TableFilterManager class

**Example Implementations**:

- **Simple Filters**: `src/routes/dashboard/claims/components/table-claims/toolbar/claims-toolbar.svelte` - Standard toolbar with FlexSearch and badge filters
- **Hierarchical Search**: `src/routes/dashboard/retailers/components/table-retailers/toolbar/retailers-toolbar.svelte` - Parent-child search with expand/collapse actions
- **Date Range Filters**: `src/routes/dashboard/claims/components/table-bordereau/toolbar/bordereau-toolbar.svelte` - Year/month selection with date range filtering (needs refactoring to new pattern)
- **Temporal Filters**: `src/routes/dashboard/policies/components/table-bordereau/toolbar/bordereau-toolbar.svelte` - Temporal filtering (needs refactoring to new pattern)

**Example Filter Components**:

- ✅ `src/routes/dashboard/claims/components/table-claims/toolbar/status-filter.svelte` - Badge-based filter (uses filterManager)
- ⚠️ `src/routes/dashboard/claims/components/table-bordereau/toolbar/year-filter.svelte` - Year selection (needs refactoring to use filterManager)
- ⚠️ `src/routes/dashboard/claims/components/table-bordereau/toolbar/month-filter.svelte` - Month selection (needs refactoring to use filterManager)

**Example Action Components**:

- `src/routes/dashboard/claims/components/table-bordereau/toolbar/export-csv-action.svelte` - CSV export
- `src/routes/dashboard/retailers/components/table-retailers/toolbar/export-qr-action.svelte` - QR export
