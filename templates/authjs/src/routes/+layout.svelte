<script lang="ts">
  import "../app.css";

  import Toaster from "$lib/components/ui/sonner/sonner.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { page } from "$app/stores";

  let { children } = $props();
</script>

<Toaster
  position="top-center"
  duration={3000}
  closeButton={true}
  richColors={true}
/>

<svelte:head>
  <title>{$page.data.branding?.title || "My App"}</title>
  <link rel="icon" href={$page.data.branding?.favicon || "/favicon.png"} />
</svelte:head>

{@render children?.()}

<ModeWatcher />
