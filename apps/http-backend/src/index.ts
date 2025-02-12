import express from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import jwt from "jsonwebtoken";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

const app = express();

app.post("/signup", (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        userId: "123"
    })


    //get that user id
    
    

    
})
app.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userId = 1; 
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })


})


app.post("/room", middleware,  (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        roomId: 123
    })

})



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`HTTP BE listening on port ${PORT}`)
})