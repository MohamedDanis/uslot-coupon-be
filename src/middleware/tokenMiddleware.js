import jwt from 'jsonwebtoken'
import asyncHandler from "express-async-handler";


const token = asyncHandler((req,res,next)=>{
    if(req.headers.authorization!==undefined){
        const tk = req.headers.authorization.split(' ')[1];
        if(tk){
            try {
                const decoded = jwt.verify(tk,process.env.JWT_SECRET)
                console.log(decoded,'token decoded');
                next()
            } catch (error) {
                res.status(401);
                throw new Error('Not authorized, token failed');
            }
        }else{
            res.status(401);
        throw new Error('Not authorized, no token');
        }
    }else{
        res.status(400)
        throw new Error('No token');
    }
   
})

export {token}