import { tv, type VariantProps } from 'tailwind-variants'

export const inputVariants = tv({
  base: 'w-full rounded-lg border bg-white px-4 transition-colors duration-200 outline-none placeholder:text-gray-400',
  variants: {
    size: {
      sm: 'h-8 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg',
    },
    error: {
      true: 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500',
      false: 'border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand',
    },
    disabled: {
      true: 'bg-gray-100 cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: {
    size: 'md',
    error: false,
  },
})

export type InputVariants = VariantProps<typeof inputVariants>
