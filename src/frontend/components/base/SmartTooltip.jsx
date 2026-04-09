import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import "#src/frontend/components/base/SmartTooltip.css"

export function SmartTooltip({
  type = "hover",
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  children,
  content,
  ...props
}) {
  const isManual = type === "manual"
  const isControlled = controlledOpen !== undefined

  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = disabled
    ? false
    : isManual
    ? controlledOpen ?? false
    : isControlled
    ? controlledOpen
    : internalOpen

  const handleOpenChange = (nextOpen) => {
    if (disabled || isManual) return

    if (!isControlled) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={handleOpenChange} {...props}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content" sideOffset={5}>
            {content}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
