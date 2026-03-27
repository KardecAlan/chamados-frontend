<script setup>
import { cn } from '@/lib/utils'
const props = defineProps({ variant: { type: String, default: 'default' }, size: { type: String, default: 'default' }, disabled: Boolean, class: String, type: { type: String, default: 'button' } })
const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
}
const sizes = { default: 'h-10 px-4 py-2', sm: 'h-8 px-3 text-xs', lg: 'h-11 px-8', icon: 'h-9 w-9' }
</script>
<template>
  <button :type="props.type" :disabled="disabled" :class="cn('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], props.class)"><slot /></button>
</template>
