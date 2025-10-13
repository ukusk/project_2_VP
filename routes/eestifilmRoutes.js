const express = require("express");
const router = express.Router();

router.route("/").get(eestifilm);

router.route("/inimesed").get(inimesed);

router.route("/filmiinimesed_add").get(inimesedAdd);

router.route("/filmiinimesed_add").post(inimesedAddPost);







app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_add", async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu vÃµi ebakorrektsed"});
	}
	
	else {
		try {
			conn = await mysql.createConnection(dbConfInga);
			console.log("AndmebaasiÃ¼hendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaÃµnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("AndmebaasiÃ¼hendus on suletud!");
			}
		}
	}
});