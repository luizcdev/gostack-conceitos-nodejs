const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateParamId( request, response, next)  {
  const { id } = request.params;

  const index = repositories.findIndex(repositorie => repositorie.id == id );
  if ( index < 0 ) 
    return response.status(400).json({ error: "Repositorie not found"});

  request.params.index = index;

  return next();

}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repositorie = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", validateParamId, (request, response) => {
  const { id, index } = request.params;  


  const { title, techs, url } = request.body;
  const { likes } = repositories[index];
  repositories[index] = {
    id,
    title,
    techs,
    url,
    likes
  }

  return response.json( repositories[index] );

});

app.delete("/repositories/:id", validateParamId,  (request, response) => {
  const { index } = request.params;
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateParamId, (request, response) => {
  const { index } = request.params;
  repositories[index].likes += 1;

  return response.json( repositories[index]);
});

module.exports = app;
