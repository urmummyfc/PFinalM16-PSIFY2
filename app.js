const express = require ('express')
const mysql = require(`mysql2`);
const axios = require (`axios`);
const app = express()
const part = 3000

app.use(express.json());

// Criação da conexão com a base de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',       // Endereço do servidor MySQL
  user: 'root',            // Músicas do MySQL
  password: '',            // Senha do MySQL
  database: 'songs',       // Nome da base de dados
  port: 3306
});

app.set(`view engine`, `ejs`);



app.get ('/', (req,res) => {
  res.render("index")
})

app.get ('/song/:id', (req,res) => {
  const id = req.params.id;
  
  axios.get(`http://localhost:3000/api/songs/${id}`)
  .then(response =>{
    console.log('Success:',response.data);
    res.render('song', {song:response.data, precoLike: PricePerLike})
  })
  .catch((error)=>{ 
    console.error('Error',error);
  });

})


//Rota para obter detalhes de uma música específica
app.get('/api/songs/:id', (req, res) => {

  const id = req.params.id;
  
    // Onde definimos a query
    const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id = ${id}`;
  
      // Executa a myQuery
      connection.query(myQuery, (err, results) => {
    
        // Dar erro se err existir
        if (err) {
          return res.status(500).send('Erro ao buscar Música: ' + err.message);
        }

        if (results.length == 0){
          return res.status(404).send('Esse Id não foi encontrado, tente novamente');
        }
        
        // Enviar resposta
        res.json(results);
      });
  
  }); 


// Rota para atualizar uma música pelo ID
app.put('/api/songs/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.Titulo;
  const artist = req.body.Artista;
  const album = req.body.Album; //opcional
  const genre = req.body.Genero; //opcional
  const duration_seconds = req.body.Duracao; //opcional
  const release_date = req.body.data; //opcional
  const likes = req.body.likes;

  const query = `UPDATE ${NOME_TABELA} SET title = "${title}", artist = "${artist}", album = "${album}", genre = "${genre}", duration_seconds = "${duration_seconds}", release_date = "${release_date}", likes = "${likes}"  WHERE id = "${id}"`;

  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao atualizar Música: ' + err.message);
    }

    if (results.length == 0){
      return res.status(404).send('Esse Id não foi encontrado, tente novamente');
    }

    // Enviar resposta
    res.status(200).send('Música atualizada com sucesso!');
  });
});

app.put('/songs/:id', (req, res) => {
  const id = req.params.id;
  axios.put(`http://localhost:3000/api/songs/${id}`)
  .then(response =>{
    console.log('Success:',response.data);
  })
  .catch((error)=>{
    console.error('Error',error);
  })

});


// Rota para apagar uma música pelo ID
app.delete('/api/songs/:id', (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM ${NOME_TABELA} WHERE id = ${id}`;

  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao deletar Música: ' + err.message);
    }
    // Enviar resposta
    res.status(200).send('Música removida com sucesso!');
  });
});

app.delete('/songs/:id', (req, res) => {
  const id = req.params.id;
  axios.delete(`http://localhost:3000/api/songs/${id}`)
  .then(response =>{
    console.log('Success:',response.data);
    res.send('')
  })
  .catch((error)=>{
    console.error('Error',error);
  })

});

const NOME_TABELA = "songs";

//direciona o botao "Adicionar musica" para o ficheiro new-song.ejs
app.get ('/new-song', (req,res) => {
    res.render("new-song")
})

//adiciona a nova musica na BD
app.post ('/api/song', (req,res) => {
    const title = req.body.Titulo;
    const artist = req.body.Artista;
    const album = req.body.Album; //opcional
    const genre = req.body.Genero; //opcional
    const duration_seconds = req.body.Duracao; //opcional
    const release_date = req.body.data; //opcional
    const likes = req.body.likes;

  
    const query = `INSERT INTO ${NOME_TABELA} (title, artist, album, genre, duration_seconds, release_date, likes) VALUES ("${title}", "${artist}", "${album}","${genre}", "${duration_seconds}", "${release_date}", "${likes}")`;
    connection.query(query, (err, results) => {
      // Dar erro se err existir
      if (err) {
        return res.status(500).send('Erro ao adicionar Música: ' + err.message);
      }

      if (results.length == 0){
        return res.status(404).send('Esse Id não foi encontrado, tente novamente');
      }
      // Enviar resposta
      res.status(200).send('Música adicionada com sucesso!');
    });
})


//vai buscar as songs na BD
app.get ('/api/songs', (req,res) => {
  
    // Onde definimos a query
    const myQuery = `SELECT * FROM ${NOME_TABELA}`
  
    // Executa a myQuery
    connection.query(myQuery, (err, results) => {
  
      // Dar erro se err existir
      if (err) {
        return res.status(500).send('Erro ao buscar Música: ' + err.message);
      }

      if (results.length == 0){
        return res.status(404).send('Esse Id não foi encontrado, tente novamente');
      }
      
    return res.json(results);
    });
})


app.get ('/songs', (req,res) => {
  
  axios.get('http://localhost:3000/api/songs')
  .then(response =>{
    console.log('Success:',response.data);
    res.render('songs',{songs:response.data})
  })
  .catch((error)=>{ 
    console.error('Error',error);
  }); 
  
});



//direciona o botao "listar musicas" para o ficheiro lista.ejs
app.get ('/price', (req,res) => {
  res.render('price' , { precoLike: PricePerLike});
})

let PricePerLike = 0.2;

//Rota para atualizar o preço por like
app.put('/api/price', (req,res) => {
  PricePerLike = req.body.price;
  res.status(200).send('O Preço foi atualizado com sucesso!');
});



const PORT= 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em https://localhost:${PORT}`);
})