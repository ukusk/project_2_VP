const express = require("express");
const fs = require("fs");
//pÃ¤ringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
const mysql =require("mysql2");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../VP2025cfg");
const textRef = "public/txt/vanasonad.txt";
//kÃ¤ivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//mÃ¤Ã¤ran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//mÃ¤Ã¤ran Ã¼he pÃ¤ris kataloogi avalikult kÃ¤ttesaadavaks
app.use(express.static("public"));
//parsime pÃ¤ringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiÃ¼henduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_inga_petuhhov_TA"
});

app.get("/", (req, res)=>{
	//res.send("Express.js lÃ¤ks kÃ¤ima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vÃ¤ljastame veebilehe, liuhtsalt vanasÃµnu pole Ã¼htegi
			res.render("genericlist", {heading: "Valik Eesti vanasÃµnu", listData: ["Ei leidnud Ã¼htegi vanasÃµna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasÃµnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vÃ¤ljastame veebilehe, liuhtsalt vanasÃµnu pole Ã¼htegi
			res.render("genericlist", {heading: "Registreeritud kÃ¼lastused", listData: ["Ei leidnud Ã¼htegi kÃ¼lastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud kÃ¼lastused", listData: correctListData});
		}
	});
});

app.get("/Eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else {
			console.log(sqlres);
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu vÃµi ebakorrektsed"});
	}
	else {
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput], (err, sqlres)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaÃµnnestus"});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
			}
		});
		
	}
});

app.listen(5111);