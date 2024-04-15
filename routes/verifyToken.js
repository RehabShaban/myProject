const jwt = require('jsonwebtoken');


exports.verifyToken =(req,res,next )=>{

    const authHeader = req.headers.token;
    if(authHeader){

        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SEC,(err,data)=>{
            //err for rong token or expired token
            if (err) res.status(401).json("Token is not valid!");
            req.client=data;
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated");
    }
};

exports.verifyTokenAndAuthorization=(req, res, next)=>{
this.verifyToken(req, res,()=>{
    if(req.client.id===req.params.id||req.client.isManager||req.client.isDesigner){
        next()
    }else{
        res.status(403).json("You are not alowed to do that");  
    }
})

};

exports.verifyTokenAndManager=(req, res, next)=>{
    this.verifyToken(req, res,()=>{
        if(req.client.isManager){
            next()
        }else{
            res.status(403).json("You are not alowed to do that");  
        }
    })
    
    };


    exports.verifyTokenAndDesigner=(req, res, next)=>{
        this.verifyToken(req, res,()=>{
            if(req.client.isDesigner){
                next()
            }else{
                res.status(403).json("You are not alowed to do that");  
            }
        })
        
        }