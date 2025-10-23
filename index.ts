import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { json } from "stream/consumers";
import axios from "axios";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error detectado:", err.message);
  res
    .status(500)
    .json({ error: "Error interno del servidor", detail: err.message });
};


type Team = {

 id: number

 name: string

 city: string

 titles: number

}

let teams: Team[] = [

 { id: 1, name: "Lakers", city: "Los Angeles", titles: 17 },

 { id: 2, name: "Celtics", city: "Boston", titles: 17 },

];


app.get("/teams",(req,res)=>{
    res.status(200).json(teams);//status 200 es que esta bien. json teams devuelve teams
})


app.get("/teams/:id",(req,res)=>{
    const id = Number (req.params.id);//coge el id que pasa el usuario
    const equipobuscado = teams.find((x)=>{
        return x.id===id;
    })
    if(!equipobuscado){
      res.status(404).json({ message: "Equipo no encontrado" })
    }else{
      res.status(200).json(equipobuscado)
    }
})

app.post("/teams",(req,res)=>{
    const ultimoequipo = teams.at(-1);
    const nuevoId = ultimoequipo ? ultimoequipo.id+1 : 0;

    const nuevoEquipo = {
        id : nuevoId,
        ...req.body
    }
    teams.push(nuevoEquipo);
    console.log(nuevoEquipo);
    res.status(200).json({message: "Equipo creado"});

})

app.delete("/teams/:id",(req,res)=>{
  const id = Number (req.params.id);//coge el id que pasa el usuario
    const equipobuscado = teams.find((x)=>{
        return x.id===id;
    })
    if(!equipobuscado){
      res.status(404).json({ message: "Equipo no encontrado" })
    }else{
      teams = teams.filter((x)=>{
        return x.id!==id;
      })
      res.status(200).json({message : "Equipo borrado"})
    }

})
//arrancar servidor 
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

const testApi = async() => {

  setTimeout(() => {
        console.log("Han pasado 2 segundos");
    }, 2000);

  await axios.get("http://localhost:3000/teams").then((res)=>console.log(res.data));

  await axios.post("http://localhost:3000/teams",{ name: "Bulls", city: "Chicago", titles: 6 } 
  ).then((res)=>console.log(res.data));

  await axios.get("http://localhost:3000/teams").then((res)=>console.log(res.data));

  await axios.delete("http://localhost:3000/teams/3").then((res)=>console.log(res.data));

  await axios.get("http://localhost:3000/teams").then((res)=>console.log(res.data));
}
testApi();
console.log("hola")