const {expressjwt:expressJwt}= require('express-jwt');

function authJwt(){
    const secret=process.env.secret
    return expressJwt(
        {
          secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
        }
        
    ).unless({
     path:[
        {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
        {url:/\/products(.*)/,methods:['GET','POST','PUT','OPTIONS']},
        {url:/\/categories(.*)/,methods:['GET','OPTIONS']},
        '/users/login',
        '/users/register',
        '/users',
        {url:'/orders',methods:['POST']},
        { url: /\/orders\/(.*)/, methods: ['GET','DELETE'] } 
     ]
    })
}

async function isRevoked(req, load) {
    if (!load.payload.isAdmin) {
        // Log if the user is not an admin
        console.log('User is not an admin:',load. payload.isAdmin);
        return true;  // Revoking token for non-admin users
    } else {
        console.log('User is an admin');
        return false;  // Allow access for admins
    }
}
module.exports=authJwt;