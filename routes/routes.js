const express = require("express");
const router = express.Router();
const User = require("../model/model");
const multer = require("multer")


var storage = multer.diskStorage({
    destination:function(req, file, cb ){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.filename+ "_"+Date.now()+"_"+file.originalname)
    }
})

var upload = multer({
    storage: storage,

}).single("image");




router.post("/add", upload, async (req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone:req.body.phone,
        // image:req.body.filename,
    });

    
    user.save().then(() =>{
        req.session.message = {
            type:'success',
            message:'user added successfully'
        };
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    });

});


// 2

// app.post("/register", function(req, res){
//     const newUser = new User({
//         email: req.body.email,
//         password: req.body.password
//     });

//     newUser.save().then(()=>{
//         res.render("secrets");
//     }).catch((err)=>{
//         console.log(err);
//     })
// });





router.get("/", async (req, res) => {
    const user = await User.find();
     
    try {
        res.render('index', {
            title: "Home Page",
            user: user
        })

    }
     catch(err) {
            console.log(err);
        };
    
   
})




// User.find().exec((err, users) => {
//     if(err) {
//         res.json({ message: err.message})
//     } else {
//         res.render('index', {
//             title: "Homepage",
//             users: users
//         })
//     }
// })




router.get("/add", (req, res) => {
    res.render("add_user", {title: "add_user"})
});




router.get("/edit/:id", async (req, res)=> {
    let id = req.params.id;
   
    const user = await User.findById(id);
    

    try{
    res.render("edit_users", {
        user: user,
        title: "edit_user",
      
    });

    } catch(err){
        if(err){
            res.redirect("/");
        } else {
            if(user === null){
                res.redirect("/")
            } else {
                res.render("edit_users")
            }
        }
    }
    //     id, (err,user) => {
    //     if(err){
    //         res.redirect("/");
    //     } else {
    //         if(user == null){
    //             res.redirect("/")
    //         } else {
    //             res.render("edit_user", {
    //                 title: "edit user",
    //                 user: user,
    //             })
    //         }
    //     }
    // })
});

router.post("/update/:id", async (req, res)=>{
    let id = req.params.id;
    

    const user = await User.findByIdAndUpdate(id,{
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });
        try{
            await user.save()
            // const user = await User.save();
            // if (user) {
            //     res.redirect('/')
                
            // } else {
            //     console.log("error")
                
            // }
            res.redirect("/")
        }catch(err){
            console.log(err)
        }
        

    });

   
    // {
       
    // },(result, err) => {
    //     if(result) {
    //         res.redirect("/")
    //     } else {
    //         console.log(err)
    //     }
    

    // })


    

// })

router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
    const user = await User.findByIdAndRemove(id);

    try {
        res.redirect("/")
    } catch (err) {
        console.log(err)
        
    }

})

module.exports = router;