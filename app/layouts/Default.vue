<template>
  <div>
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Navigation from "~/components/Navigation.vue";
import Header from "~/areas/Header.vue";
</script>
