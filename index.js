const express = require("express"); // käivitan express.js-i ja annan talle nimeks "app"
const app = express();
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyparser = require("body-parser");
// url rendering motor, aka viewengine
app.set("view engine", "ejs"); //peab kasutama ejs-i, 
//set one catalogue as publicly accessible
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", (req, res)=>{
	//res.end("express.js is running");
	res.render("index");
});
// req res päring ja väljund, URLi kontrollimiseks

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow}); 
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Vanasõnad", listData: ["Did not find"]});
	    }
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Vanasõnad", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});	

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	res.render("regvisit");
});

app.listen(5111);
