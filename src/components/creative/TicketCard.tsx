"use client"

import { cn } from "@/lib/utils"
import { Ticket, DESIGN_TYPE_CONFIG, PRIORITY_CONFIG } from "@/types/creative"
import { TicketStatusBadge } from "./TicketStatusBadge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Paperclip,
  AlertCircle,
  Flame,
  ArrowRight,
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
  const priority = PRIORITY_CONFIG[ticket.priority]

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
  const isDueSoon = ticket.dueDate && !isOverdue && 
    new Date(ticket.dueDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000 &&
    ticket.status !== "delivered"

  // Calculate progress for production tickets
  const progress = ticket.status === "production" && ticket.estimatedHours
    ? Math.min((ticket.trackedTime / ticket.estimatedHours) * 100, 100)
    : null

  if (variant === "compact") {
    return (
      <Link href={`/creative/tickets/${ticket.id}`}>
        <Card
          className={cn(
            "p-3 hover:shadow-md transition-all cursor-pointer border-l-4",
            isDragging && "shadow-lg rotate-2 scale-105",
            className
          )}
          style={{ borderLeftColor: ticket.brandColor || "#3b82f6" }}
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
            "p-4 hover:shadow-md transition-all cursor-pointer",
            isDragging && "shadow-lg",
            className
          )}
        >
          <div className="flex items-center gap-4">
            {/* Brand Color Bar */}
            <div
              className="w-1 h-12 rounded-full shrink-0"
              style={{ backgroundColor: ticket.brandColor || "#3b82f6" }}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{designType.icon}</span>
                <h3 className="font-medium truncate">{ticket.title}</h3>
                {ticket.priority === "urgent" && (
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
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
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10">
                  {getInitials(ticket.assigneeName)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30" />
            )}

            {/* Due Date */}
            {ticket.dueDate && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-red-500" : "text-muted-foreground"
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

  // Kanban variant (default) - Enhanced
  return (
    <Link href={`/creative/tickets/${ticket.id}`}>
      <Card
        className={cn(
          "relative overflow-hidden transition-all cursor-pointer group",
          "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30",
          isDragging && "shadow-xl rotate-2 scale-105 ring-2 ring-primary/50",
          isOverdue && "ring-1 ring-red-500/50 bg-red-500/5",
          isDueSoon && !isOverdue && "ring-1 ring-amber-500/30",
          className
        )}
      >
        {/* Brand Color Accent - Left Border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
          style={{ backgroundColor: ticket.brandColor || "#3b82f6" }}
        />

        <div className="p-3 pl-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs text-muted-foreground truncate">
                {ticket.brandName}
              </span>
            </div>
            {(ticket.priority === "urgent" || ticket.priority === "high") && (
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-[10px] px-1.5 py-0 h-5 font-semibold gap-1",
                  ticket.priority === "urgent" 
                    ? "border-red-500/50 bg-red-500/10 text-red-600" 
                    : "border-amber-500/50 bg-amber-500/10 text-amber-600"
                )}
              >
                {ticket.priority === "urgent" && <Flame className="h-3 w-3" />}
                {ticket.priority === "urgent" ? "Urgent" : "High"}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {ticket.title}
          </h3>

          {/* Design Type */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-base">{designType.icon}</span>
            <span className="text-xs text-muted-foreground font-medium">{designType.label}</span>
          </div>

          {/* Progress Bar (for production tickets) */}
          {progress !== null && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {/* Left: Assignee */}
            <div className="flex items-center gap-2">
              {ticket.assigneeName ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-6 w-6 ring-2 ring-background">
                    <AvatarFallback className="text-[10px] bg-primary/10 font-medium">
                      {getInitials(ticket.assigneeName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {ticket.assigneeName.split(" ")[0]}
                  </span>
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">?</span>
                </div>
              )}
            </div>

            {/* Right: Meta info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              {/* Comments count */}
              {ticket.comments.length > 0 && (
                <div className="flex items-center gap-0.5 text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                  <MessageSquare className="h-3 w-3" />
                  <span>{ticket.comments.length}</span>
                </div>
              )}

              {/* Attachments count */}
              {(ticket.attachments.length > 0 || ticket.versions.length > 0) && (
                <div className="flex items-center gap-0.5 text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                  <Paperclip className="h-3 w-3" />
                  <span>{ticket.attachments.length + ticket.versions.length}</span>
                </div>
              )}

              {/* Due date */}
              {ticket.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded",
                    isOverdue 
                      ? "bg-red-500/10 text-red-600 font-medium" 
                      : isDueSoon 
                        ? "bg-amber-500/10 text-amber-600" 
                        : "bg-muted/50"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ticket.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Arrow Indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-2">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </Card>
    </Link>
  )
}
