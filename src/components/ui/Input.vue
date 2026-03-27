<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ class: String, modelValue: [String, Number] })
defineEmits(['update:modelValue'])
</script>
<template>
  <input :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', props.class)" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" v-bind="$attrs" />
</template>
