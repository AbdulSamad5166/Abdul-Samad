/**
 * =======================================================================
 * Day 4: Professional UI Component Library
 * =======================================================================
 * Reusable, accessible, and type-safe UI components built with Tailwind CSS.
 * =======================================================================
 */

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button.tsx'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from './Card.tsx'
export { Input, type InputProps, type InputState } from './Input.tsx'
export { Modal, type ModalProps } from './Modal.tsx'
export { Dropdown, type DropdownProps, type DropdownItem } from './Dropdown.tsx'
export { Navigation, type NavigationProps, type NavItemType } from './Navigation.tsx'
export { Tabs, type TabsProps, type TabItem } from './Tabs.tsx'
export { Alert, type AlertProps, type AlertVariant } from './Alert.tsx'
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge.tsx'
export {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  type SkeletonProps,
} from './Skeleton.tsx'
export { uiPatterns } from './uiPatterns.ts'
