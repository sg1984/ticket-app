import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Navigator from "./Navigator";
import Content from "./Content";
import Header from "./Header";
import SingIn from "./SingIn";
import ShowTickets from "./ShowTickets";
import ShowGroups from "./ShowGroups";
import ShowUsers from "./ShowUsers";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/List";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Ticket App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

let theme = createMuiTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c",
      },
    },
    MuiButton: {
      label: {
        textTransform: "none",
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854",
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

const drawerWidth = 256;

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    padding: theme.spacing(6, 4),
    background: "#eaeff1",
  },
  footer: {
    padding: theme.spacing(2),
    background: "#eaeff1",
  },
};

const LOCAL_STORAGE_VARIABLE = "userTicketAppData";

function App(props) {
  const { classes } = props;

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPageId, setCurrentPageId] = useState("show-tickets");
  const [pageTitle, setPageTitle] = useState("Listar Tickets");
  const [categories, setCategories] = useState([]);

  const handleCategories = () => {
    const adminOptions = {
      title: "Admin",
      children: [
        {
          id: "users",
          title: "Usuários",
          icon: <AccountCircleIcon />,
        },
        {
          id: "groups",
          title: "Grupos",
          icon: <PeopleIcon />,
        },
      ],
    };

    const ticketChildren = [];

    const ticketCategories = {
      title: "Tickets",
      children: [
        {
          id: "show-tickets",
          title: "Listar Tickets",
          icon: <ListIcon />,
        },
      ],
    };

    const categoriesToUse = [];

    if (user) {
      if (["ADMIN"].includes(user.role)) {
        categoriesToUse.unshift(adminOptions);
      }
    }
    categoriesToUse.push(ticketCategories);
    setCategories(categoriesToUse);
  };

  const isTokenValid = (token) => {
    return fetch("/test-logged", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.status !== 200) {
        handleLogout();
      }
    });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VARIABLE));
    if (userData && userData !== "undefinded" && userData !== "null") {
      if (isTokenValid(userData.token)) {
        setUser(userData);
        setIsLogged(true);
        handleCategories();
      } else {
        handleLogout();
      }
    }
  }, [isLogged]);

  const handleLoginSucess = (userData) => {
    setIsLogged(true);
    localStorage.setItem(LOCAL_STORAGE_VARIABLE, JSON.stringify(userData));
    handleCategories();
    window.location.reload(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLogged(false);
    setCategories([]);
    localStorage.removeItem(LOCAL_STORAGE_VARIABLE);
    window.location.reload(false);
  };

  const handleChangePage = (pageId, newPageTitle) => {
    setCurrentPageId(pageId);
    setPageTitle(newPageTitle);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      {!isLogged ? (
        <SingIn onLoginSucess={handleLoginSucess} />
      ) : (
        <div className={classes.root}>
          <CssBaseline />
          <nav className={classes.drawer}>
            <Hidden xsDown implementation="css">
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                categories={categories}
                onChangePage={handleChangePage}
                userData={user}
              />
            </Hidden>
          </nav>
          <div className={classes.app}>
            <Header
              onDrawerToggle={handleDrawerToggle}
              onLogout={handleLogout}
              pageTitle={pageTitle}
            />
            <main className={classes.main}>
              {user ? (
                <div>
                  {currentPageId === "show-tickets" && (
                    <ShowTickets user={user} />
                  )}
                  {currentPageId === "groups" && <ShowGroups user={user} />}
                  {currentPageId === "users" && <ShowUsers user={user} />}
                </div>
              ) : (
                <Content />
              )}
            </main>
            <footer className={classes.footer}>
              <Copyright />
            </footer>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
