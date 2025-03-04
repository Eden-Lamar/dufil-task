const router = require("express").Router()

router.use("/user", require("./authRoute"))
router.use("/item", require("./itemRoute"))


module.exports = router