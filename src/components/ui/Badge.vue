<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ variant: { type: String, default: 'default' }, class: String })
const variants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input bg-background',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  muted: 'bg-muted text-muted-foreground',
}
</script>
<template>
  <span :class="cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], props.class)"><slot /></span>
</template>
