module.exports = {
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            return res.redirect('/')
        }
        
    },

    isNotLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect('/user')
        }else{
            return next();
        }
    }
}