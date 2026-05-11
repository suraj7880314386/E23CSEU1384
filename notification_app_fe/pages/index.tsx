import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Box, Typography, CircularProgress, Button, FormControl, Select, MenuItem,
  Pagination, Paper, Tooltip, IconButton, List, Drawer, ListItem,
  ListItemIcon, ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DraftsIcon from "@mui/icons-material/Drafts";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";

// --- LOGGING MIDDLEWARE IMPORT ---
import { Log } from "@/logging_middleware/logger"; 

import { fetchNotifications, Notification, NotificationType } from "@/lib/notifications";
import { getViewedIds, markAsViewed, markAllAsViewed } from "@/lib/viewedStore";
import NotificationCard from "@/components/NotificationCard";

const NOTIFICATION_TYPES: NotificationType[] = ["Event", "Result", "Placement"];
const PAGE_LIMIT = 15;
const DRAWER_WIDTH = 250;

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setViewedIds(getViewedIds());
    Log("frontend", "info", "page", "Inbox page mounted");
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    Log("frontend", "info", "api", `Fetching notifications: Page ${page}, Type ${typeFilter || 'All'}`);
    
    try {
      const data = await fetchNotifications({
        limit: PAGE_LIMIT,
        page,
        notification_type: typeFilter || undefined,
      });
      setNotifications(data);
      setTotalPages(data.length < PAGE_LIMIT ? page : page + 1);
      Log("frontend", "debug", "api", `Successfully fetched ${data.length} notifications`);
    } catch (err) {
      Log("frontend", "error", "api", `Error fetching notifications: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkViewed = useCallback((id: string) => {
    markAsViewed(id);
    setViewedIds((prev) => new Set([...prev, id]));
    Log("frontend", "info", "page", `Notification ${id} marked as viewed`);
  }, []);

  const handleMarkAllViewed = () => {
    const ids = notifications.map((n) => n.ID);
    markAllAsViewed(ids);
    setViewedIds((prev) => new Set([...prev, ...ids]));
    Log("frontend", "info", "page", "All visible notifications marked as read");
  };

  const newCount = notifications.filter((n) => !viewedIds.has(n.ID)).length;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Inbox - Notifications</title>
      </Head>

      {/* Gmail-style Top App Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          borderBottom: '1px solid #f1f3f4',
          backgroundColor: '#fff',
          zIndex: 1200,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: DRAWER_WIDTH }}>
          <IconButton sx={{ mr: 2 }}><MenuIcon /></IconButton>
          <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Gmail_icon_%282020%29.svg" alt="logo" width={24} style={{ marginRight: 12 }} />
            Notifications
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, maxWidth: 720, px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eaf1fb',
              borderRadius: '24px',
              padding: '4px 8px',
              transition: 'background-color 0.2s, box-shadow 0.2s',
              '&:hover': { backgroundColor: '#fff', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)' }
            }}
          >
            <IconButton size="small" sx={{ color: '#5f6368', mr: 1 }}><SearchIcon /></IconButton>
            <Typography sx={{ flexGrow: 1, color: '#5f6368', fontSize: '1rem', ml: 1, border: 'none', backgroundColor: 'transparent' }} component="input" placeholder="Search in emails" />
            <IconButton size="small" sx={{ color: '#5f6368' }}><TuneIcon /></IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Support"><IconButton size="small"><HelpOutlineIcon /></IconButton></Tooltip>
          <Tooltip title="Settings"><IconButton size="small"><SettingsIcon /></IconButton></Tooltip>
          <Tooltip title="Google apps"><IconButton size="small"><AppsIcon /></IconButton></Tooltip>
          <IconButton size="small" sx={{ ml: 1 }}><AccountCircleIcon fontSize="large" sx={{ color: '#1a73e8' }} /></IconButton>
        </Box>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            backgroundColor: '#F6F8FC',
            pt: '80px', // Below app bar
          },
        }}
      >
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#c2e7ff',
              color: '#001d35',
              borderRadius: '16px',
              py: 1.5,
              px: 3,
              boxShadow: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: '#b3d9f3', boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3)' }
            }}
            startIcon={<DraftsIcon />}
            fullWidth
            onClick={handleMarkAllViewed}
            disabled={newCount === 0}
          >
            Mark all as read
          </Button>
        </Box>
        <List sx={{ px: 1 }}>
          <ListItem
            component="a"
            href="/"
            sx={{
              borderRadius: '0 16px 16px 0',
              backgroundColor: '#d3e3fd', // Active state
              color: '#0b57d0',
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            <ListItemIcon sx={{ color: '#0b57d0', minWidth: 40 }}><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }} />
            {newCount > 0 && (
              <Typography variant="caption" fontWeight="bold">{newCount}</Typography>
            )}
          </ListItem>
          
          <Link href="/priority" passHref legacyBehavior>
            <ListItem
              component="a"
              button
              sx={{
                borderRadius: '0 16px 16px 0',
                color: '#444746',
                '&:hover': { backgroundColor: '#e9eef6' }
              }}
            >
              <ListItemIcon sx={{ color: '#444746', minWidth: 40 }}><StarIcon /></ListItemIcon>
              <ListItemText primary="Starred (Priority)" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </ListItem>
          </Link>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 2, pt: '80px', display: 'flex', flexDirection: 'column' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            borderRadius: 4, 
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          {/* Toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #f1f3f4' }}>
            <Tooltip title="Select">
              <IconButton size="small" sx={{ mr: 1 }}><CheckBoxOutlineBlankIcon fontSize="small" /></IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={loadNotifications} sx={{ mr: 2 }}><RefreshIcon fontSize="small" /></IconButton>
            </Tooltip>
            
            <FormControl size="small" variant="standard" sx={{ minWidth: 120 }}>
              <Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as NotificationType | "");
                  setPage(1);
                }}
                displayEmpty
                disableUnderline
                sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#5f6368' }}
              >
                <MenuItem value="">All Types</MenuItem>
                {NOTIFICATION_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => setPage(val)}
                size="small"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': { border: 'none', color: '#5f6368' },
                  '& .Mui-selected': { backgroundColor: '#f1f3f4 !important' }
                }}
              />
              <IconButton size="small" sx={{ ml: 1 }}><SettingsIcon fontSize="small" /></IconButton>
            </Box>
          </Box>

          {/* Email List Container */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={30} sx={{ color: '#1a73e8' }} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box textAlign="center" py={8} color="#5f6368">
                <Typography>Your inbox is empty.</Typography>
              </Box>
            ) : (
              <Box>
                {notifications.map((n) => (
                  <NotificationCard
                    key={n.ID}
                    notification={n}
                    isViewed={viewedIds.has(n.ID)}
                    onMarkViewed={handleMarkViewed}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
