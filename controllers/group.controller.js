const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require("../config/connectMySQL");

function read(req, res) {
  const query = connect.con.query(
    "SELECT id, name, isActive, createdAt FROM groups order by id",
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
    "SELECT id, name, isActive, createdAt FROM groups where id = ? order by id ",
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
  const name = req.sanitize("name").escape();
  req
    .checkBody("name", "Insira apenas texto ou números")
    .matches(/^[a-z 1-9]+$/i);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (name != "NULL" && typeof name != "undefined") {
      const post = { name: name };
      const query = connect.con.query(
        "INSERT INTO groups SET ?",
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
  const name = req.sanitize("name").escape();
  const idGroup = parseInt(req.sanitize("id").escape());
  req
    .checkBody("name", "Insira apenas texto ou números")
    .matches(/^[a-z 1-9]+$/i);
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      idGroup != "NULL" &&
      typeof name != "undefined" &&
      typeof idGroup != "undefined"
    ) {
      const update = [name, idGroup];
      const query = connect.con.query(
        "UPDATE groups SET name =?, updatedAt = now() WHERE id=?",
        update,
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

function toggle(req, res) {
  const update = [parseInt(req.sanitize("id").escape())];
  const query = connect.con.query(
    "UPDATE groups SET isActive = !isActive, updatedAt = now() WHERE id=?",
    update,
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

function deleteGroup(req, res) {
  const update = parseInt(req.sanitize("id").escape());

  const query = connect.con.query(
    "DELETE FROM groups WHERE id=?",
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

module.exports = {
  read: read,
  readID: readID,
  save: save,
  update: update,
  toggle: toggle,
  deleteGroup: deleteGroup,
};
