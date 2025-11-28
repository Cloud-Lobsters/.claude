<script lang="ts">
  // This is a placeholder dashboard layout
  // Replace with your own sidebar/header components as needed
  
  let { children } = $props();
</script>

<div class="min-h-screen">
  <!-- Add your dashboard header/sidebar here -->
  <main>
    {@render children?.()}
  </main>
</div>
