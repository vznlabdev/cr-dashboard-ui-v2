"use client"

import { cn } from "@/lib/utils"
import { Ticket, TicketStatus, TICKET_STATUS_CONFIG } from "@/types/creative"
import { TicketCard } from "./TicketCard"
import {
  Send,
  ClipboardCheck,
  UserCheck,
  Cog,
  Eye,
  CheckCircle2,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface KanbanColumnProps {
  status: TicketStatus
  tickets: Ticket[]
  className?: string
}

const STATUS_ICONS: Record<TicketStatus, React.ComponentType<{ className?: string }>> = {
  submitted: Send,
  assessment: ClipboardCheck,
  assigned: UserCheck,
  production: Cog,
  qa_review: Eye,
  delivered: CheckCircle2,
}

const STATUS_COLORS: Record<TicketStatus, { bg: string; border: string; dot: string; gradient: string }> = {
  submitted: {
    bg: "bg-blue-500/5",
    border: "border-t-blue-500",
    dot: "bg-blue-500",
    gradient: "from-blue-500/20 to-transparent",
  },
  assessment: {
    bg: "bg-purple-500/5",
    border: "border-t-purple-500",
    dot: "bg-purple-500",
    gradient: "from-purple-500/20 to-transparent",
  },
  assigned: {
    bg: "bg-amber-500/5",
    border: "border-t-amber-500",
    dot: "bg-amber-500",
    gradient: "from-amber-500/20 to-transparent",
  },
  production: {
    bg: "bg-orange-500/5",
    border: "border-t-orange-500",
    dot: "bg-orange-500",
    gradient: "from-orange-500/20 to-transparent",
  },
  qa_review: {
    bg: "bg-cyan-500/5",
    border: "border-t-cyan-500",
    dot: "bg-cyan-500",
    gradient: "from-cyan-500/20 to-transparent",
  },
  delivered: {
    bg: "bg-green-500/5",
    border: "border-t-green-500",
    dot: "bg-green-500",
    gradient: "from-green-500/20 to-transparent",
  },
}

export function KanbanColumn({ status, tickets, className }: KanbanColumnProps) {
  const config = TICKET_STATUS_CONFIG[status]
  const colors = STATUS_COLORS[status]
  const Icon = STATUS_ICONS[status]

  return (
    <div
      className={cn(
        "flex flex-col min-w-[320px] max-w-[320px] rounded-xl border border-border/50 overflow-hidden",
        "bg-gradient-to-b",
        colors.gradient,
        className
      )}
    >
      {/* Colored Top Border */}
      <div className={cn("h-1", colors.dot)} />

      {/* Column Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={cn("p-1.5 rounded-lg", colors.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{config.label}</h3>
            <p className="text-xs text-muted-foreground">
              {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "text-sm font-bold px-2.5 py-1 rounded-full",
            colors.bg,
            config.color
          )}
        >
          {tickets.length}
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-380px)] space-y-3">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/20">
            <Icon className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground/60">No tickets</p>
            {status === "submitted" && (
              <Link href="/creative/tickets/new" className="mt-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  New Request
                </Button>
              </Link>
            )}
          </div>
        ) : (
          tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className="animate-in fade-in slide-in-from-top-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TicketCard ticket={ticket} variant="kanban" />
            </div>
          ))
        )}
      </div>

      {/* Column Footer - Quick Stats */}
      {tickets.length > 0 && (
        <div className="px-4 py-2 border-t border-border/30 bg-background/50 text-xs text-muted-foreground">
          {status === "production" && (
            <span className="flex items-center gap-1">
              <Cog className="h-3 w-3 animate-spin-slow" />
              {tickets.length} in progress
            </span>
          )}
          {status === "delivered" && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              All complete
            </span>
          )}
          {(status === "submitted" || status === "assessment") && (
            <span>Awaiting action</span>
          )}
          {status === "assigned" && (
            <span>Ready to start</span>
          )}
          {status === "qa_review" && (
            <span>Under review</span>
          )}
        </div>
      )}
    </div>
  )
}
