const router = require("express").Router();
const { auth } = require("../config/login_config");
const controllerGroup = require("../controllers/group.controller.js");
const controllerUser = require("../controllers/user.controller.js");
const controllerTask = require("../controllers/task.controller.js");

// Groups management
router.get("/groups/", auth.required, controllerGroup.read);
router.get("/groups/:id", auth.required, controllerGroup.readID);
router.post("/groups/", auth.required, controllerGroup.save);
router.put("/groups/:id", auth.required, controllerGroup.update);
router.put("/groups/:id/toggle/", auth.required, controllerGroup.toggle);
router.delete("/groups/:id", auth.required, controllerGroup.deleteGroup);

// Users management
router.get("/users/", auth.required, controllerUser.read);
router.get("/users/:id", auth.required, controllerUser.readID);
router.post("/users/", auth.required, controllerUser.save);
router.put("/users/:id", auth.required, controllerUser.update);
router.put("/users/:id/toggle", auth.required, controllerUser.toggle);
router.delete("/users/:id", auth.required, controllerUser.deleteUser);

// Tasks management
router.get("/tasks/", auth.required, controllerTask.read);
router.get("/tasks/:id", auth.required, controllerTask.readID);
router.post("/tasks/", auth.required, controllerTask.save);
router.put("/tasks/:id", auth.required, controllerTask.update);
router.delete("/tasks/:id", auth.required, controllerTask.deleteTask);
router.put(
  "/tasks/:id/delegate/:userId",
  auth.required,
  controllerTask.delegateTask
);
router.put("/tasks/:id/status", auth.required, controllerTask.updateStatus);

module.exports = router;
