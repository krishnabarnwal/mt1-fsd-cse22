
const express=require("express");
const app=express();
app.use(express.json());

let books=[];
let nextId=1;

app.post("/api/books",(req,res)=>{
    const {title,author,year}=req.body||{};
    if(!title||!author||typeof title!=="string"||
       typeof author!=="string"||typeof year!=="number"){
        return res.status(400).json({message:"Invalid or missing data"});
    }
    if(books.some(b=>b.title.toLowerCase()===title.toLowerCase())){
        return res.status(409).json({message:"Book already exists"});
    }
    const book={id:nextId++,title,author,year};
    books.push(book);
    res.status(201).json(book);
});

app.get("/api/books",(req,res)=>{
    const {author}=req.query;
    if(author){
        return res.status(200).json(
            books.filter(b=>b.author.toLowerCase()===author.toLowerCase())
        );
    }
    res.status(200).json(books);
});

app.get("/api/books/:id",(req,res)=>{
    const book=books.find(b=>b.id===Number(req.params.id));
    if(!book){
        return res.status(404).json({message:"Book not found"});
    }
    res.status(200).json(book);
});

app.put("/api/books/:id",(req,res)=>{
    const book=books.find(b=>b.id===Number(req.params.id));
    if(!book){
        return res.status(404).json({message:"Book not found"});
    }
    const {title,author,year}=req.body||{};
    if(!title||!author||typeof title!=="string"||
       typeof author!=="string"||typeof year!=="number"){
        return res.status(400).json({message:"Invalid or missing data"});
    }
    if(books.some(b=>b.id!==book.id&&
       b.title.toLowerCase()===title.toLowerCase())){
        return res.status(409).json({message:"Book already exists"});
    }
    book.title=title;
    book.author=author;
    book.year=year;
    res.status(200).json(book);
});

app.delete("/api/books/:id",(req,res)=>{
    const index=books.findIndex(b=>b.id===Number(req.params.id));
    if(index===-1){
        return res.status(404).json({message:"Book not found"});
    }
    books.splice(index,1);
    res.status(200).json({message:"Book deleted successfully"});
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
