// Import the http module
const http = require('http')

// Import the fs module
const fs = require('fs')

// Import the path module to get the full pathname
const path = require('path')

// Use environment varialbes
const dotenv = require('dotenv')
dotenv.config()

// Create server
const server = http.createServer((request, response) => {

  // Target directory
  const directory = 'logs'

  if (request.url === '/') {
    response.writeHead(200, {
      'Content-type': 'text/html'
    })
    response.write('<h1>Home</h1>')
  } else if (request.url === '/file/create') {
    // Create a file
    const fileName = 'accesslog.txt'
    const fileContent = 'This is the first line ========='
    const filePath = path.join(directory, fileName)

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.log(err)
        return
      }
    })
    console.log(`${fileName} was created......`)
    response.writeHead(200, {
      'Content-type': 'text/plain'
    })
    response.write('File created...')
    response.end()
  } else if (request.url === '/file/read') {
    // Read a file
    const fileToRead = 'accesslog.txt'
    const filePath = path.join(directory, fileToRead)

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`${filePath} was opened...`)
      response.writeHead(200, {
        'Content-type': 'text/plain'
      })
      response.write(data)
      response.end()
    })
  } else if (request.url === '/file/update') {
    // Update/Append a file
    const fileToUpdate = 'accesslog.txt'
    const filePath = path.join(directory, fileToUpdate)
    const dateNow = new Date()

    fs.appendFile(filePath, `\r\nUser visited ${request.url} at ${dateNow}`, (err) => {
      if (err) {
        console.log(err)
        return
      }
      response.writeHead(201, {
        'Content-type': 'text/plain'
      })
      response.write('File was updated....')
      response.end()
    })
  } else if (request.url === '/file/delete') {
    // Delete a file
    const fileToDelete = 'accesslog.txt'
    const filePath = path.join(directory, fileToDelete)

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('File was not deleted: ', err)
        return
      }
      response.writeHead(200, {
        'Content-style': 'text/plain'
      })
      response.write(`${fileToDelete} was deleted....`)
      response.end()
    })
  } else if (request.url === '/file/rename') {
    // Rename a file
    const fileToRename = 'accesslog.txt'
    const filePath = path.join(directory, fileToRename)
    const newFilename = 'new-accesslog.txt'
    const newFilePath = path.join(directory, newFilename)

    fs.rename(filePath, newFilePath, (err) => {
      if (err) {
        console.log('File was not renamed')
        return
      }
      response.writeHead(200, {
        'Content-type': 'text/plain'
      })
      response.write(`${fileToRename} was renamed to ${newFilename}...`)
      response.end()
    })
  } else if (request.url === '/file/list') {
    // List files in directory
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.log(err)
        return
      }
      response.writeHead(200, {
        'Content-type': 'application/json'
      })
      response.write(JSON.stringify(files))
      response.end()
    })
  } else {
    response.writeHead(404, {
      'Content-type': 'text/html'
    })
    response.write('<h1>You are lost...</h1>')
    response.end()
  }

})

// Start the server
const port = process.env.PORT || '4000'
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})