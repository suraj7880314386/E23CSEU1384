import React, { useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Avatar,
  Divider,
} from "@mui/material";
import { Notification, NotificationType } from "@/lib/notifications";

interface Props {
  notification: Notification;
  isViewed: boolean;
  priorityScore?: number;
  onMarkViewed?: (id: string) => void;
  rank?: number;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  Placement: {
    label: "Placement",
    color: "#1a73e8", // Blue
    icon: <WorkOutlinedIcon fontSize="small" sx={{ color: "#1a73e8" }} />,
  },
  Result: {
    label: "Result",
    color: "#e37400", // Orange
    icon: <SchoolOutlinedIcon fontSize="small" sx={{ color: "#e37400" }} />,
  },
  Event: {
    label: "Event",
    color: "#1e8e3e", // Green
    icon: <EventOutlinedIcon fontSize="small" sx={{ color: "#1e8e3e" }} />,
  },
};

function formatShortDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function NotificationCard({
  notification,
  isViewed,
  priorityScore,
  onMarkViewed,
  rank,
}: Props) {
  const cfg = TYPE_CONFIG[notification.Type as NotificationType] ?? {
    label: notification.Type,
    color: "#5f6368",
    icon: null,
  };

  const isStarred = priorityScore !== undefined;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    onMarkViewed?.(notification.ID);
    setOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        p: { xs: 1.5, sm: "8px 16px" },
        borderBottom: "1px solid #f1f3f4",
        backgroundColor: isViewed ? "#ffffff" : "#f2f6fc", // Unread gets subtle blue tint
        color: isViewed ? "#5f6368" : "#202124",
        cursor: "pointer",
        transition: "box-shadow 0.15s ease",
        "&:hover": {
          boxShadow: "inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)",
          zIndex: 1,
          position: "relative",
          backgroundColor: "#ffffff",
        },
      }}
    >
      {/* Action / Star Area */}
      <Box display="flex" alignItems="center" mr={2} width={{ xs: 40, sm: 60 }} justifyContent="space-between">
        <Tooltip title={isStarred ? `Priority Score: ${priorityScore}` : "Not prioritized"}>
          <IconButton size="small" sx={{ p: 0.5, color: isStarred ? "#fbbc04" : "#dadce0" }}>
            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        
        {rank && (
          <Typography variant="caption" sx={{ fontWeight: 500, color: "#5f6368", display: { xs: 'none', sm: 'block' } }}>
            #{rank}
          </Typography>
        )}
      </Box>

      {/* Type Area (Sender equivalent) */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1} 
        width={{ xs: 100, sm: 160 }} 
        flexShrink={0}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {cfg.icon}
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isViewed ? 400 : 700,
            color: isViewed ? "#5f6368" : cfg.color,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {cfg.label}
        </Typography>
      </Box>

      {/* Message Area (Subject equivalent) */}
      <Box flex={1} minWidth={0} px={1}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isViewed ? 400 : 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {notification.Message}
        </Typography>
      </Box>

      {/* Date Area */}
      <Box width={{ xs: 60, sm: 80 }} textAlign="right" flexShrink={0} ml={1}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isViewed ? 400 : 700,
            fontSize: "0.75rem"
          }}
        >
          {formatShortDate(notification.Timestamp)}
        </Typography>
      </Box>
    </Box>

    {/* Dummy Email Dialog */}
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: { height: "80vh", borderRadius: 2, m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #f1f3f4' }}>
        <Tooltip title="Back to inbox">
          <IconButton onClick={handleClose} sx={{ mr: 2 }}><ArrowBackIcon /></IconButton>
        </Tooltip>
        <Box flexGrow={1} />
        <Tooltip title="Print"><IconButton size="small"><PrintIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="In new window"><IconButton size="small"><OpenInNewIcon fontSize="small" /></IconButton></Tooltip>
      </Box>
      
      <DialogContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight={400}>
            {cfg.label} Notification: {notification.Message}
          </Typography>
          {isStarred && (
            <Tooltip title={`Priority Score: ${priorityScore}`}>
              <StarIcon sx={{ color: "#fbbc04", ml: 2 }} />
            </Tooltip>
          )}
        </Box>

        <Box display="flex" alignItems="center" mb={4}>
          <Avatar sx={{ bgcolor: cfg.color, width: 40, height: 40, mr: 2 }}>
            {notification.Type.charAt(0)}
          </Avatar>
          <Box flexGrow={1}>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" component="span" sx={{ fontWeight: 700, mr: 1 }}>
                AffordMed Campus System
              </Typography>
              <Typography variant="caption" color="text.secondary">
                &lt;noreply@affordmed.com&gt;
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              to me
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              {new Date(notification.Timestamp).toLocaleString()}
            </Typography>
            <Tooltip title="Reply"><IconButton size="small"><ReplyIcon fontSize="small" /></IconButton></Tooltip>
            <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
          </Box>
        </Box>

        <Box sx={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#202124', pl: 7 }}>
          <Typography paragraph>Hello Student,</Typography>
          <Typography paragraph>
            You have a new {notification.Type.toLowerCase()} update on the campus portal.
          </Typography>
          <Typography paragraph sx={{ fontWeight: 500, p: 2, bgcolor: '#f1f3f4', borderRadius: 2 }}>
            "{notification.Message}"
          </Typography>
          <Typography paragraph>
            Please log in to the portal to view full details or take any necessary actions.
          </Typography>
          <Typography paragraph sx={{ mt: 4, color: '#5f6368' }}>
            Best regards,<br/>
            The Placement & Events Cell
          </Typography>

          <Divider sx={{ my: 4 }} />
          <Typography variant="caption" color="text.disabled">
            Ref ID: {notification.ID}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  </>
  );
}
