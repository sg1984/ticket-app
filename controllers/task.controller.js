const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

function findById(taskId) {
  const query = connect.con.query(
    "SELECT * FROM tasks t where t.id = ? order by id",
    id,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);

        return [];
      } else {
        if (rows.length == 0) {
          return [];
        } else {
          return rows[0];
        }
      }
    }
  );
}

function read(req, res) {
  const query = connect.con.query(
    "SELECT t.id, t.title, t.content, g.id AS groupId, g.name AS groupName, t.responsibileId AS userId, u.name AS responsibleName, t.createdBy as createdById, c.name as createdByName, t.status, t.createdAt FROM tasks t LEFT JOIN groups g ON g.id = t.groupId LEFT JOIN users u ON u.id = t.responsibileId LEFT JOIN users c ON c.id = t.createdBy order by id",
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows);
        }
      }
    }
  );
}

function readID(req, res) {
  const id = req.sanitize("id").escape();
  const query = connect.con.query(
    "SELECT t.id, t.title, t.content, g.id AS groupId, g.name AS groupName, t.responsibileId AS userId, u.name AS responsibleName, t.createdBy as createdById, c.name as createdByName, t.status, t.createdAt FROM tasks t LEFT JOIN groups g ON g.id = t.groupId LEFT JOIN users u ON u.id = t.responsibileId LEFT JOIN users c ON c.id = t.createdBy where t.id = ? order by id",
    id,
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows[0]);
        }
      }
    }
  );
}

function save(req, res) {
  const groupId = parseInt(req.sanitize("groupId"));
  const title = req.sanitize("title").escape();
  const content = req.sanitize("content").escape();

  let responsibileId = parseInt(req.sanitize("responsibileId"));
  if (responsibileId && typeof responsibileId != "undefined") {
    update = { ...update, responsibileId };
  } else {
    responsibileId = null;
  }

  const status = req.sanitize("status").escape();
  req
    .checkBody("title", "Insira apenas texto ou números")
    .matches(/^[a-z 1-9]+$/i);
  req.checkBody("content", "Insira um conteúdo").notEmpty();
  req.checkBody("groupId", "Escolha um grupo").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      title != "NULL" &&
      typeof title != "undefined" &&
      content != "NULL" &&
      typeof content != "undefined" &&
      groupId != "NULL" &&
      typeof groupId != "undefined"
    ) {
      const post = {
        title,
        content,
        groupId,
        createdBy: req.payload.id,
        status,
        responsibileId,
      };
      const query = connect.con.query(
        "INSERT INTO tasks SET ?",
        post,
        function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
            res
              .status(jsonMessages.db.successInsert.status)
              .location(rows.insertId)
              .send(jsonMessages.db.successInsert);
          } else {
            console.log(err);
            res
              .status(jsonMessages.db.dbError.status)
              .send(jsonMessages.db.dbError);
          }
        }
      );
    } else
      res
        .status(jsonMessages.db.requiredData.status)
        .send(jsonMessages.db.requiredData);
  }
}

function update(req, res) {
  let update = {};

  const taskId = parseInt(req.sanitize("id").escape());
  if (taskId != "NULL" && typeof taskId != "undefined") {
    req.checkBody("taskId", "Task inválido");
  }

  const groupId = parseInt(req.sanitize("groupId"));
  if (groupId && typeof groupId != "undefined") {
    update = { ...update, groupId };
  }

  const title = req.sanitize("title").escape();
  if (title && typeof title != "undefined") {
    update = { ...update, title };
  }

  const content = req.sanitize("content").escape();
  if (content && typeof content != "undefined") {
    update = { ...update, content };
  }

  const responsibileId = parseInt(req.sanitize("responsibileId"));
  if (responsibileId && typeof responsibileId != "undefined") {
    update = { ...update, responsibileId };
  }

  const status = req.sanitize("status").escape();
  if (status && typeof status != "undefined") {
    update = { ...update, status };
  }

  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (Object.entries(update).length > 0) {
      const query = connect.con.query(
        "UPDATE tasks SET ?, updatedAt = now() WHERE id=?",
        [update, taskId],
        function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
            res
              .status(jsonMessages.db.successUpdate.status)
              .send(jsonMessages.db.successUpdate);
          } else {
            console.log(err);
            res
              .status(jsonMessages.db.dbError.status)
              .send(jsonMessages.db.dbError);
          }
        }
      );
    } else
      res
        .status(jsonMessages.db.requiredData.status)
        .send(jsonMessages.db.requiredData);
  }
}

function deleteTask(req, res) {
  const update = parseInt(req.sanitize("id").escape());
  const query = connect.con.query(
    "DELETE FROM tasks WHERE id=?",
    update,
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res
          .status(jsonMessages.db.successDelete.status)
          .send(jsonMessages.db.successDelete);
      } else {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      }
    }
  );
}

function delegateTask(req, res) {
  const id = parseInt(req.sanitize("id").escape());
  const userId = parseInt(req.sanitize("userId").escape());
  const query = connect.con.query(
    "UPDATE tasks SET responsibileId=?, updatedAt = now() WHERE id=?",
    [userId, id],
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res
          .status(jsonMessages.db.successUpdate.status)
          .send(jsonMessages.db.successUpdate);
      } else {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      }
    }
  );
}

function updateStatus(req, res) {
  const id = parseInt(req.sanitize("id").escape());
  const status = req.sanitize("status").escape();
  const query = connect.con.query(
    "UPDATE tasks SET status=?, updatedAt = now() WHERE id=?",
    [status, id],
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        res
          .status(jsonMessages.db.successUpdate.status)
          .send(jsonMessages.db.successUpdate);
      } else {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      }
    }
  );
}

module.exports = {
  read: read,
  readID: readID,
  save: save,
  update: update,
  deleteTask: deleteTask,
  delegateTask: delegateTask,
  updateStatus: updateStatus,
};
