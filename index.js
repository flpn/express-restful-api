const express = require('express')
const app = express()

app.use(express.json())

var baseCourseUrl = '/api/courses'
var port = process.env.PORT || 3000
var courses = [
  { id: 1, name: 'Python Course' },
  { id: 2, name: 'Nodejs Course' },
  { id: 3, name: 'Angular Course' }
]

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get(baseCourseUrl, (req, res) => {
  res.send(courses)
})

app.get(baseCourseUrl + ':id', (req, res) => {
  let course = courses.find(course => course.id == req.params.id)

  if(!course) {
    res.status(404).send('The course with the given ID was not found!')
  }
  else {
    res.send(course)
  }

})

app.post(baseCourseUrl, (req, res) => {
  let newCourse = {
    id: courses.length + 1,
    name: req.body.name
  }

  courses.push(newCourse)
  res.send(newCourse)
})

app.listen(port, () => console.log(`Listening on port ${port}...`))
