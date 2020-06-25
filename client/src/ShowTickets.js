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
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TicketRow from "./TicketRow";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
  const [pageLoad, setPageLoad] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskGroupId, setNewTaskGroupId] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [newTaskResponsibileId, setNewTaskResponsibileId] = useState("");

  const isLoading = status === "LOADING";

  const loadTickets = () => {
    setStatus("LOADING");
    loadGroups();
    loadUsers();
    return fetch("/tasks", {
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
        console.log("rows", rows);
        setRows(rows);
        setStatus("LOADED");
      })
      .catch(() => setStatus("ERROR"));
  };

  const loadGroups = () => {
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
        setGroupList(rows);
      })
      .catch(() => setStatus("ERROR"));
  };

  const loadUsers = () => {
    loadGroups();
    return fetch("/users", {
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
        setListUsers(rows);
        setStatus("LOADED");
      })
      .catch(() => setStatus("ERROR"));
  };

  const sendForm = (e) => {
    setStatus("LOADING");
    e.preventDefault();
    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        title: newTaskTitle,
        content: newTaskContent,
        groupId: newTaskGroupId,
        status: newTaskStatus,
        responsibileId: newTaskResponsibileId,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          setNewTaskTitle("");
          setNewTaskContent("");
          setNewTaskGroupId("");
          setNewTaskStatus("");
          setNewTaskResponsibileId("");
          setShowForm(false);
          return loadTickets();
        }
        setStatus("ERROR");

        return null;
      })
      .catch(() => setStatus("ERROR"));
  };

  const deleteTask = (taskId) => {
    setStatus("LOADING");
    return fetch("/tasks/" + taskId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return loadTickets();
        }
        setStatus("ERROR");
      })
      .catch(() => setStatus("ERROR"));
  };

  useEffect(() => {
    loadTickets();
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
                + Ticket
              </Button>
              <IconButton onClick={loadTickets}>
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
                        id="newTaskTitle"
                        label="Título"
                        name="newTaskTitle"
                        value={newTaskTitle.value}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        disabled={isLoading}
                      />
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        rows={4}
                        id="newTaskContent"
                        label="Conteúdo"
                        name="newTaskContent"
                        value={newTaskContent.value}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        disabled={isLoading}
                      />
                      <InputLabel id="newUserRole">Responsável</InputLabel>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="newTaskResponsibileId"
                          id="newTaskResponsibileId"
                          onChange={(event) =>
                            setNewTaskResponsibileId(event.target.value)
                          }
                          autoWidth
                        >
                          {listUsers &&
                            listUsers.map((userRow) => (
                              <MenuItem value={userRow.id}>
                                {userRow.userName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <InputLabel id="newTaskGroupId">Grupo</InputLabel>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="newTaskGroupId"
                          id="newTaskGroupId"
                          onChange={(event) =>
                            setNewTaskGroupId(event.target.value)
                          }
                          autoWidth
                        >
                          {groupList.map((groupRow) => (
                            <MenuItem value={groupRow.id}>
                              {groupRow.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <InputLabel id="newTaskStatus">Status</InputLabel>
                      <FormControl className={classes.formControl}>
                        <Select
                          labelId="newTaskStatus"
                          id="newTaskStatus"
                          onChange={(event) =>
                            setNewTaskStatus(event.target.value)
                          }
                          autoWidth
                        >
                          {[
                            "OPEN",
                            "ASSIGN_TO",
                            "IN_PROGRESS",
                            "CANCELED",
                            "DONE",
                          ].map((statusOption) => (
                            <MenuItem value={statusOption}>
                              {statusOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

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

        {status === "LOADED" && rows.length ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell>Grupo</StyledTableCell>
                  <StyledTableCell>Título</StyledTableCell>
                  <StyledTableCell>Criado Por</StyledTableCell>
                  <StyledTableCell>Criado Em</StyledTableCell>
                  <StyledTableCell>Responsável</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TicketRow
                    key={row.id}
                    row={row}
                    setStatus={setStatus}
                    listUsers={listUsers}
                    loadTickets={loadTickets}
                    user={user}
                    groupList={groupList}
                    deleteTask={deleteTask}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          !isLoading && (
            <Typography color="textSecondary" align="center">
              Não foram encontrados tickets cadastrados.
            </Typography>
          )
        )}

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
