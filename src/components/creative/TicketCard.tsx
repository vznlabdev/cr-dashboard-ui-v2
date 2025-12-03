"use client"

import { cn } from "@/lib/utils"
import { Ticket, DESIGN_TYPE_CONFIG, PRIORITY_CONFIG } from "@/types/creative"
import { TicketStatusBadge } from "./TicketStatusBadge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Paperclip,
  Circle,
} from "lucide-react"
import Link from "next/link"

interface TicketCardProps {
  ticket: Ticket
  variant?: "kanban" | "list" | "compact"
  className?: string
  isDragging?: boolean
}

export function TicketCard({
  ticket,
  variant = "kanban",
  className,
  isDragging = false,
}: TicketCardProps) {
  const designType = DESIGN_TYPE_CONFIG[ticket.designType]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== "delivered"

  // Calculate progress for production tickets
  const progress = ticket.status === "production" && ticket.estimatedHours
    ? Math.min((ticket.trackedTime / ticket.estimatedHours) * 100, 100)
    : null

  if (variant === "compact") {
    return (
      <Link href={`/creative/tickets/${ticket.id}`}>
        <Card
          className={cn(
            "p-3 hover:bg-accent/50 transition-colors cursor-pointer",
            isDragging && "shadow-lg",
            className
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium truncate flex-1">{ticket.title}</span>
            <TicketStatusBadge status={ticket.status} size="sm" showDot={false} />
          </div>
        </Card>
      </Link>
    )
  }

  if (variant === "list") {
    return (
      <Link href={`/creative/tickets/${ticket.id}`}>
        <Card
          className={cn(
            "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
            isDragging && "shadow-lg",
            className
          )}
        >
          <div className="flex items-center gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{designType.icon}</span>
                <h3 className="font-medium truncate">{ticket.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{ticket.brandName}</span>
                <span>•</span>
                <span>{designType.label}</span>
              </div>
            </div>

            {/* Status */}
            <TicketStatusBadge status={ticket.status} size="sm" />

            {/* Assignee */}
            {ticket.assigneeName ? (
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(ticket.assigneeName)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/30" />
            )}

            {/* Due Date */}
            {ticket.dueDate && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(ticket.dueDate)}
              </div>
            )}
          </div>
        </Card>
      </Link>
    )
  }

  // Kanban variant (default) - Minimal design
  return (
    <Link href={`/creative/tickets/${ticket.id}`}>
      <Card
        className={cn(
          "p-3 transition-all cursor-pointer group bg-card",
          "hover:bg-accent/50 hover:shadow-sm",
          isDragging && "shadow-md ring-1 ring-primary/20",
          isOverdue && "border-destructive/30",
          className
        )}
      >
        {/* Header: Brand + Priority */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-muted-foreground truncate">
            {ticket.brandName}
          </span>
          {(ticket.priority === "urgent" || ticket.priority === "high") && (
            <Circle 
              className={cn(
                "h-2 w-2 fill-current",
                ticket.priority === "urgent" ? "text-destructive" : "text-primary"
              )} 
            />
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-snug">
          {ticket.title}
        </h3>

        {/* Design Type */}
        <div className="flex items-center gap-1.5 mb-3 text-muted-foreground">
          <span className="text-sm">{designType.icon}</span>
          <span className="text-xs">{designType.label}</span>
        </div>

        {/* Progress Bar (for production tickets) */}
        {progress !== null && (
          <div className="mb-3">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/60 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          {/* Assignee */}
          {ticket.assigneeName ? (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-muted">
                {getInitials(ticket.assigneeName)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground/30" />
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 text-muted-foreground">
            {ticket.comments.length > 0 && (
              <div className="flex items-center gap-0.5 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>{ticket.comments.length}</span>
              </div>
            )}

            {(ticket.attachments.length > 0 || ticket.versions.length > 0) && (
              <div className="flex items-center gap-0.5 text-xs">
                <Paperclip className="h-3 w-3" />
                <span>{ticket.attachments.length + ticket.versions.length}</span>
              </div>
            )}

            {ticket.dueDate && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs",
                  isOverdue && "text-destructive"
                )}
              >
                <Clock className="h-3 w-3" />
                <span>{formatDate(ticket.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
