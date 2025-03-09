import express from "express"
import userController from "../controller/usercontroller.js"
import DtataChequer from "../middlewares/datachecker.js"
import validator from "../middlewares/validation.js"
import VerifyAccess from "../middlewares/velifyaccess.js"



const router=express.Router();

router.post("/signup",DtataChequer.userRegisterIsEmpty,DtataChequer.emailExist,validator.userAccountRule(),validator.inputvalidator,userController.signup)
router.post("/login",userController.Login)
router.get("/get",VerifyAccess("admin"),userController.getuser)
router.get("/get/:id",userController.getoneuser)
router.delete("/delete",VerifyAccess("admin"),userController.deleteuser)
router.delete("/delete/:id",userController.deleteoneuser)
router.patch("/update/:id",userController.updateoneuser)
router.get("/role", VerifyAccess("user"), userController.getUserRole)

export default router