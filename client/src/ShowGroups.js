import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import RefreshIcon from "@material-ui/icons/Refresh";
import Alert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: "block",
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: "40px 16px",
  },
  table: {
    minWidth: 650,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function ShowTickets(props) {
  const { classes, user } = props;

  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("IDLE");
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [pageLoad, setPageLoad] = useState(null);

  const isLoading = status === "LOADING";

  const loadGroups = () => {
    setStatus("LOADING");
    return fetch("/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((rows) => {
        setRows(rows);
        setStatus("LOADED");
      })
      .catch(() => setStatus("ERROR"));
  };

  const toogleGroup = (groupId) => {
    setStatus("LOADING");
    return fetch("/groups/" + groupId + "/toggle", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          loadGroups();
        }
      })
      .catch(() => setStatus("ERROR"));
  };

  const deleteGroup = (groupId) => {
    setStatus("LOADING");
    return fetch("/groups/" + groupId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          loadGroups();
        }
        setStatus("ERROR");
      })
      .catch(() => setStatus("ERROR"));
  };

  const sendForm = (e) => {
    setStatus("LOADING");
    e.preventDefault();
    fetch("/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        name: newGroupName,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          setNewGroupName("");
          setShowForm(false);
          return loadGroups();
        }

        return null;
      })
      .catch(() => setStatus("ERROR"));
  };

  useEffect(() => {
    loadGroups();
  }, [pageLoad]);

  return (
    <Paper className={classes.paper}>
      <AppBar
        className={classes.searchBar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.addUser}
                onClick={() => setShowForm(!showForm)}
              >
                + Grupo
              </Button>
              <IconButton onClick={loadGroups}>
                <RefreshIcon className={classes.block} color="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        {showForm && (
          <Box mb={5}>
            <Grid justify="center" container>
              <Grid item xs={6}>
                <Card className={classes.root}>
                  <CardContent>
                    <form
                      className={classes.form}
                      noValidate
                      onSubmit={sendForm}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="newGroupName"
                        label="Nome do grupo"
                        name="newGroupName"
                        value={newGroupName.value}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        disabled={isLoading}
                      />
                      <CardActions>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          disabled={isLoading}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={isLoading}
                          onClick={() => setShowForm(!showForm)}
                        >
                          Cancelar
                        </Button>
                        {status === "ERROR" && (
                          <Alert severity="error">
                            Erro no sistema, favor tentar novamente mais tarde!
                          </Alert>
                        )}
                      </CardActions>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        {status === "LOADED" &&
          (rows.length ? (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Nome</StyledTableCell>
                    <StyledTableCell>Criado em</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Ativo</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={Boolean(row.isActive)}
                          onChange={() => toogleGroup(row.id)}
                          color="primary"
                          name={"checked" + row.id}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat("en-GB").format(
                          new Date(row.createdAt)
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => deleteGroup(row.id)}
                          disabled={isLoading}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" align="center">
              Não foram encontrados grupos cadastrados.
            </Typography>
          ))}

        {isLoading && (
          <Grid justify="center" container spacing={3}>
            <CircularProgress />
          </Grid>
        )}

        {status === "ERROR" && (
          <Alert severity="error">
            Erro no sistema, favor tentar novamente mais tarde!
          </Alert>
        )}
      </div>
    </Paper>
  );
}

ShowTickets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShowTickets);
