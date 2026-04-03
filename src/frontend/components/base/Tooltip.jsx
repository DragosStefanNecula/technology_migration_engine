import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"

export function SmartTooltip({
  type = "hover",   
  open: controlledOpen,
  onOpenChange,
  children,
  content,
  ...props
}) {
  const isManual = type === "manual"
  const isControlled = controlledOpen !== undefined

  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = isManual
    ? controlledOpen ?? false
    : isControlled
    ? controlledOpen
    : internalOpen

  const handleOpenChange = (nextOpen) => {
    if (isManual) return

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
            <Tooltip.Content
            sideOffset={5}
            style={{
                backgroundColor: "white",
                color: "black",
                padding: "8px 12px",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                fontSize: "14px",
                maxWidth: "600px",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
            }}
            >
            {content}

            <Tooltip.Arrow
              style={{
                fill: "white",
              }}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}