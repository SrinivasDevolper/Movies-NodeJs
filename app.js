const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const dbPath = path.join(__dirname, 'moviesData.db')
let db = null
const initializDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializDb()
const changeDatabaseSeetingInGet = dbObject => {
  return {
    movieName: dbObject.movie_name,
  }
}
//GET Method
app.get('/movies/', async (request, response) => {
  const dbresponse = `SELECT movie_name FROM movie`
  const getDBResponse = await db.all(dbresponse)

  const res = getDBResponse.map(eachItem => {
    return changeDatabaseSeetingInGet(eachItem)
  })
  response.send(res)
})

const changeDatabaseSeetingInPost = dbObject => {
  return {
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  }
}

//POST Method
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const dbPostResponse = `
    INSERT INTO
      movie(director_id, movie_name, lead_actor)
    values(${directorId},
            '${movieName}',
            '${leadActor}')
  `
  const getPostResponse = await db.run(dbPostResponse)
  changeDatabaseSeetingInPost(getPostResponse)
  response.send('Movie Successfully')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const requireToDB = `
    SELECT * 
      FROM
    movie
    WHERE movie_id = ${movieId};
  `
  const getResponseFromDb = await db.get(requireToDB)
  console.log(getResponseFromDb)
  // response.send(getResponseFromDb)
})
