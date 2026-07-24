const express = require('express');
const app = express();
const path= require('path');
const fs =require(`fs`);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname,'public')));
app.get("/", function(req,res){
    fs.readdir(`./files`,function(err,files){
        res.render("index",{files: files});
    });
});
    app.post('/create',function(req,res){
        fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
            res.redirect("/");
        })
    });
    app.get('/file/:filename',function(req,res){
        fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
            res.render('show.ejs',{filename: req.params.filename, filedata: filedata});
        })
    });
    
    app.get('/edit/:filename',function(req,res){
        fs.readFile(`./files/${req.params.filename}`, 'utf-8',function(err,filedata){
            res.render('edit', {filename:req.params.filename, filedata:filedata});
        })
            
    })
    app.post('/edit',function(req,res){
        const oldFile= `./files/${req.body.previous}`;
        const newName= req.body.new.trim(); 
        const newFile= newName? `./files/${newName}.txt`: oldFile;  
        if(oldFile !== newFile){
        fs.rename(oldFile, newFile, function(err){
            if(err) throw err;
        fs.writeFile(newFile, `${req.body.previous_data}`, function(err){
            if(err) throw err;
            res.redirect('/');
        });
    });
         
}
else{
    fs.writeFile(oldFile, `${req.body.previous_data}`, function(err){
        if(err) throw err;
        res.redirect('/');
    });
}
    });  


app.get('/profile/:username',function(req,res){
    res.send(`${req.params.username} , here`);
})
app.get('/hello',function(req,res){
    res.send("Hello World");
})
app.listen(3000,function(){
    console.log("ITS RUNNING");
});
