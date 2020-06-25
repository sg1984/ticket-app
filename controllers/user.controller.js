const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const jsonMessagesLogin = require(jsonMessagesPath + "login");
const connect = require("../config/connectMySQL");

var bCrypt = require("bcrypt-nodejs");

var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

const canEditUsers = (payload) => ["ADMIN", "MANAGER"].includes(payload.role);

module.exports = userExists = (groupId) => {
  const query = connect.con.query(
    "SELECT id FROM groups where id = ? order by id ",
    { id: groupId },
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        return false;
      } else {
        if (rows.length == 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  );
};

function read(req, res) {
  const query = connect.con.query(
    "SELECT u.id, u.name AS userName, u.email, u.role, u.isActive, g.name AS groupName, u.createdAt FROM users u LEFT JOIN groups g ON g.id = u.groupId ORDER BY id",
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
  const id = parseInt(req.sanitize("id").escape());
  const query = connect.con.query(
    "SELECT u.id, u.name as userName, u.email, u.role, u.isActive, g.name AS groupName, u.createdAt FROM users u LEFT JOIN groups g ON g.id = u.groupId WHERE u.id = ? ORDER BY u.id ",
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
  if (!canEditUsers(req.payload)) {
    res
      .status(jsonMessagesLogin.user.unauthorized.status)
      .send(jsonMessagesLogin.user.unauthorized);
  }

  const name = req.sanitize("name").escape();
  const email = req.sanitize("email").escape();
  const password = req.sanitize("password").escape();
  const role = req.sanitize("role").escape();
  const groupId = parseInt(req.sanitize("groupId"));
  req
    .checkBody("name", "Insira apenas texto ou números")
    .matches(/^[a-z 1-9]+$/i);
  req.checkBody("email", "Insira um email valido").isEmail();
  req.checkBody("password", "Insira uma senha valida").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (
      name != "NULL" &&
      typeof name != "undefined" &&
      email != "NULL" &&
      typeof email != "undefined" &&
      password != "NULL" &&
      typeof password != "undefined" &&
      role != "NULL" &&
      typeof role != "undefined"
    ) {
      const post = {
        name,
        email,
        password: generateHash(password),
        role,
        groupId,
      };
      const query = connect.con.query(
        "INSERT INTO users SET ?",
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
  if (!canEditUsers(req.payload)) {
    res
      .status(jsonMessagesLogin.user.unauthorized.status)
      .send(jsonMessagesLogin.user.unauthorized);
  }

  const userId = parseInt(req.sanitize("id").escape());
  let update = {};
  if (userId != "NULL" && typeof userId != "undefined") {
    req.checkBody("userId", "Usuário inválido");
  }

  const name = req.sanitize("name").escape();
  if (name && typeof name != "undefined") {
    req
      .checkBody("name", "Insira apenas texto ou números")
      .matches(/^[a-z 1-9]+$/i);

    update = { ...update, name };
  }

  const email = req.sanitize("email").escape();
  if (email && typeof email != "undefined") {
    req.checkBody("email", "Insira um email valido").isEmail();

    update = { ...update, email };
  }

  const password = req.sanitize("password").escape();
  if (password && typeof password != "undefined") {
    req.checkBody("password", "Insira uma senha valida").notEmpty();

    update = { ...update, password };
  }

  const role = req.sanitize("role").escape();
  if (role && typeof role != "undefined") {
    update = { ...update, role };
  }

  const groupId = parseInt(req.sanitize("groupId"));
  if (groupId && typeof groupId != "undefined") {
    update = { ...update, groupId };
  }

  const errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    if (Object.entries(update).length > 0) {
      const query = connect.con.query(
        "UPDATE users SET ?, updatedAt = now() WHERE id=?",
        [update, userId],
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
  if (!canEditUsers(req.payload)) {
    res
      .status(jsonMessagesLogin.user.unauthorized.status)
      .send(jsonMessagesLogin.user.unauthorized);
  }

  const update = [parseInt(req.sanitize("id").escape())];
  const query = connect.con.query(
    "UPDATE users SET isActive = !isActive, updatedAt = now() WHERE id=?",
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

function deleteUser(req, res) {
  if (!canEditUsers(req.payload)) {
    res
      .status(jsonMessagesLogin.user.unauthorized.status)
      .send(jsonMessagesLogin.user.unauthorized);
  }
  const update = parseInt(req.sanitize("id").escape());
  const query = connect.con.query(
    "DELETE FROM users WHERE id=?",
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
  deleteUser: deleteUser,
};
