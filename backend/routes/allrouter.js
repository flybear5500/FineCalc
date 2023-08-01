const { calcFine, getAddress, calcAllAddress } = require("../controllers/calcController");
const router = require("express").Router();

router.get("/keyword/calcFine", calcFine);
router.get("/keyword/getAddress", getAddress);
router.get("/keyword/calcAllAddress", calcAllAddress);

module.exports = router;
