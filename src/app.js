const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];
const indexOf = (id) => repositories.findIndex((repository) => repository.id === id);
/**
 * 
 * @param {number} index 
 * @param {object} newRepositoryData 
 */
const overwriteIndex = (index, newRepositoryData) => {
  repositories[index] = newRepositoryData;
  
  return newRepositoryData;
}
app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  repositories.push({ id: uuid(), title, url, techs, likes: 0 });

  response.json(repositories[repositories.length - 1]);
});
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const index_of_id = indexOf(id);

  if (index_of_id >= 0)
    response.json(overwriteIndex(index_of_id, { id, title, url, techs, likes: repositories[index_of_id].likes }));
  else
    response.status(400).send("Repositório não existe");

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index_of_id = indexOf(id);

  if (index_of_id >= 0) {
    repositories = repositories.filter((repo) => repo.id !== id);
    response.status(204).send();
  }
  else response.status(400).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index_of_id = indexOf(id);

  if (index_of_id >= 0) {
    const new_data = overwriteIndex(index_of_id, { ...repositories[index_of_id], likes: repositories[index_of_id].likes + 1 });

    response.json({ likes: new_data.likes });
  } else {
    response.status(400).send("Repositório não existe");
  }

});

module.exports = app;
