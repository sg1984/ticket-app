import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

function TicketRow(props) {
  const {
    row,
    listUsers,
    setStatus,
    loadTickets,
    user,
    classes,
    groupList,
    deleteTask,
  } = props;
  const [open, setOpen] = React.useState(false);

  const assignUser = (taskId, userId) => {
    setStatus("LOADING");
    return fetch("/tasks/" + taskId + "/delegate/" + userId, {
      method: "PUT",
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

  const updateStatus = (taskId, newStatus) => {
    setStatus("LOADING");
    return fetch("/tasks/" + taskId + "/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return loadTickets();
        }
        setStatus("ERROR");
      })
      .catch(() => setStatus("ERROR"));
  };

  const updateGroup = (taskId, newGroupId) => {
    setStatus("LOADING");
    return fetch("/tasks/" + taskId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        groupId: newGroupId,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return loadTickets();
        }
        setStatus("ERROR");
      })
      .catch(() => setStatus("ERROR"));
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {user.role === "USER" ? (
            row.groupName
          ) : (
            <FormControl className={classes.formControl}>
              <Select
                labelId={"groupId-" + row.id}
                id={"groupId-" + row.id}
                onChange={(event) => updateGroup(row.id, event.target.value)}
                autoWidth
                value={row.groupId}
              >
                {groupList &&
                  groupList.map((groupRow) => (
                    <MenuItem value={groupRow.id}>{groupRow.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.createdByName}</TableCell>
        <TableCell>
          {new Intl.DateTimeFormat("en-GB").format(new Date(row.createdAt))}
        </TableCell>
        <TableCell>
          {user.role === "USER" ? (
            row.responsibleName
          ) : (
            <FormControl className={classes.formControl}>
              <Select
                labelId={"responsibleId-" + row.id}
                id={"responsibleId-" + row.id}
                onChange={(event) => assignUser(row.id, event.target.value)}
                autoWidth
                value={row.userId}
              >
                {listUsers &&
                  listUsers.map((userRow) => (
                    <MenuItem value={userRow.id}>{userRow.userName}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </TableCell>
        <TableCell>
          <FormControl className={classes.formControl}>
            <Select
              labelId={"statusOption-" + row.id}
              id={"statusOption-" + row.id}
              onChange={(event) => updateStatus(row.id, event.target.value)}
              autoWidth
              value={row.status ? row.status : "OPEN"}
            >
              {["OPEN", "ASSIGN_TO", "IN_PROGRESS", "CANCELED", "DONE"].map(
                (statusOption) => (
                  <MenuItem value={statusOption}>{statusOption}</MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          {user.role === "ADMIN" || user.id === row.createdById ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteTask(row.id)}
            >
              Excluir
            </Button>
          ) : (
            "-"
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Descrição
              </Typography>
              <Typography variant="body1" gutterBottom>
                {row.content}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

TicketRow.propTypes = {
  classes: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  listUsers: PropTypes.object.isRequired,
  setStatus: PropTypes.func.isRequired,
  loadTickets: PropTypes.func.isRequired,
  groupList: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default withStyles(styles)(TicketRow);
