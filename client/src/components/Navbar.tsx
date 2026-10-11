import { useState, type MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { type PageLink } from "../utils/dataTypes";

const pages: PageLink[] = [
  {
    name: "All Budgets",
    path: "/budgets",
  },
  {
    name: "Create Budget",
    path: "/budgets/new",
  },
];
const settings: PageLink[] = [
  {
    name: "Vendors",
    path: "/vendors",
  },
  {
    name: "Payment Methods",
    path: "/payments",
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Links are full page loads, so the current path is accurate on each render
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const isCurrent = (path: string): boolean => currentPath === path;

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* BRAND */}
          <Box
            component="a"
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mr: 3,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <AccountBalanceWalletIcon />
            <Typography variant="h6" component="span" noWrap>
              Budget Tracker
            </Typography>
          </Box>

          {/* MOBILE NAV MENU */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page: PageLink) => (
                <MenuItem
                  key={page.name}
                  component="a"
                  href={page.path}
                  selected={isCurrent(page.path)}
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* DESKTOP NAV LINKS */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page: PageLink) => (
              <Button
                key={page.name}
                href={page.path}
                color="inherit"
                sx={{
                  bgcolor: isCurrent(page.path)
                    ? "rgba(255, 255, 255, 0.18)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.28)" },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* SETTINGS MENU */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Vendors and payment methods">
              <IconButton
                onClick={handleOpenUserMenu}
                color="inherit"
                aria-label="open settings menu"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-settings"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting: PageLink) => (
                <MenuItem
                  key={setting.name}
                  component="a"
                  href={setting.path}
                  selected={isCurrent(setting.path)}
                  onClick={handleCloseUserMenu}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
