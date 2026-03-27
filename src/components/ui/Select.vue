<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: String, modelValue: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <select :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', props.class)" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" v-bind="$attrs"><slot /></select>
</template>
