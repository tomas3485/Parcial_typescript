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

type LD = {
id: number
lengthMinutes : number
filmName: string
region : string
rotationType : "CAV" | "CLV"
videoFormat : "NTSC" | "PAL"
}

let discos : LD []= [
    {id:1,lengthMinutes:120,filmName:"Pelicula 1",region:"España",rotationType:"CAV",videoFormat:"NTSC"},
    {id:2,lengthMinutes:240,filmName:"Pelicula 2",region:"Portugal",rotationType:"CLV",videoFormat:"PAL"},
]

app.get("/ld" ,((req,res)=>{
    res.status(200).json(discos);
}))

app.get("/ld/:id",(req,res)=>{
    const id = Number (req.params.id);
    const cdBuscado = discos.find((x)=>{
        return x.id===id;
    })
    if(!cdBuscado){
        res.status(404).json({ message :"Disco no encontrado"})
    }else{
        res.status(200).json(cdBuscado)
    }
})


app.post("/ld",(req,res)=>{
    const ultimoDisco = discos.at(-1);
    const nuevoId = ultimoDisco ? ultimoDisco.id+1 : 0;

    const nuevoDisco = {
        id : nuevoId,
        ...req.body
    }

    discos.push(nuevoDisco)
    console.log(nuevoDisco)
    res.status(201).json({message : "CD creado"})
})

app.delete("/ld/:id",(req,res)=>{
    const id = Number (req.params.id);
    const discoBuscado = discos.find((x)=>{
        return x.id===id;
    })
    if(!discoBuscado){
      res.status(404).json({ message: "Disco no encontrado" })
    }else{
      discos = discos.filter((x)=>{
        return x.id!==id;
      })
      res.status(200).json({message : "Disco borrado"})
    }
})

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

const testApi = async () => {

    setTimeout(() => {
        console.log("Ha pasado 1 segundo");
    }, 1000);
    
    await axios.get("http://localhost:3000/ld").then((res)=>console.log(res.data));
    
    await axios.post("http://localhost:3000/ld",{lengthMinutes:200,filmName:"Pelicula 3",region:"Italia",rotationType:"CLV",videoFormat:"PAL"}
    ).then((res)=>console.log(res.data));

    await axios.get("http://localhost:3000/ld").then((res)=>console.log(res.data));
    
    /*
    await axios.delete("http://localhost:3000/ld/2").then((res)=>console.log(res.data));

    await axios.get("http://localhost:3000/ld").then((res)=>console.log(res.data));
    */
}
testApi()