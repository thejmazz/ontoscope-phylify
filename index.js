// Polyfills
require('es6-promise').polyfill()
require('isomorphic-fetch')

// Requires
const _ = require('highland')
const cytoscape = require('cytoscape')
const queue = require('queue')
const obo = require('bionode-obo')

// Config
// TODO its own file, maybe bring in with webpack, etc.
let config = {
  dev: {
    BASE_URL: ''
  },
  prod: {
    BASE_URL: 'https://thejmazz.github.io/ontoscope-phylify'
  }
}
if (__DEV__)
  config = config.dev
else
  config = config.prod


const startTime = Date.now()

// TODO explain this section
// TODO better var names. e.g. buffer size is not really buffer size.
const TERMS_BUFFER_SIZE = 200
let termsBufferCounter = 0
let termsBuffer = []
let chunks = 0
// Queue
const q = queue({concurrency: 1})
// Temp counter until 'eventedness' in parser is resolved
let index = 0

let fantom = []

fetch(config.BASE_URL + '/ff-phase2-140729.obo').then( (response) => {
  if (response.status >= 400) {
      throw new Error('Bad response from server')
  }
    
  // TODO handle last 170 terms
  _(obo.terms( response.text() ))
    .each( (term) => {
      fantom[index] = term
      termsBuffer[index] = {data: {id: term.id}}
      termsBufferCounter++

      if (termsBufferCounter === TERMS_BUFFER_SIZE) {
        // Buffer filled, use it  

        q.push( (cb) => {
          setTimeout( () => {
            chunks++
            const start = (chunks-1) * TERMS_BUFFER_SIZE
            const end = chunks * TERMS_BUFFER_SIZE
            const chunkBuffer = termsBuffer.slice(start, end) 

            const sTime = Date.now()
            cy.add(chunkBuffer)
            const layout = window.cy.elements().makeLayout({name: 'grid'})
            layout.run()
            const delta = Date.now() - sTime
            console.log(`Added chunk of ${chunkBuffer.length} vertices in ${delta} ms`)

            if (chunks === 6000 / TERMS_BUFFER_SIZE) {
              const totalTime = (Date.now() - startTime) / 1000

              console.log(`Finished queue in ${totalTime} s.`)
              generateEdges()
            }

            cb()
          }, 0)  
        })

        // and restart counter
        termsBufferCounter = 0 
      }

      // TODO on end
      if (index === 6000) {
        console.log('Starting queue..')
        // TODO start queue as data streams 
        q.start()
      }

      index++
    }) 
})

// after the stream, make edges
// TODO stream in edges when possible..
const EDGES_BUFFER_SIZE = 50
let edgesBuffer = []
let edgesBufferCounter = 0
let edgesChunks = 0

let numEdges = 0

const q2 = queue({concurrency: 1})

const generateEdges = () => {
  fantom.forEach( (term, i) => {
    let target
    if (term.is_a) {
      target = term.is_a.split('!')[0].trim()
      edgesBuffer[i] = {data: { id: term.id + '-' + target, source: term.id, target}}
      edgesBufferCounter++
      // console.log(edgesBuffer[i]) 
      
        if (edgesBufferCounter === EDGES_BUFFER_SIZE) {
          q2.push( (cb) => {
            setTimeout( () => {
              edgesChunks++
              const start = (edgesChunks-1) * EDGES_BUFFER_SIZE
              const end = edgesChunks * EDGES_BUFFER_SIZE
              const chunkBuffer = edgesBuffer.slice(start, end)
             
              const sTime = Date.now() 
              // console.log(chunkBuffer)
              cy.add({edges: chunkBuffer})
              numEdges += chunkBuffer.length
              // console.log('added some edges')
              const delta = Date.now() - sTime
              console.log(numEdges + ' after ' + delta + ' ms')

              if (numEdges === 6150) {
                button.innerHTML += ' (ready)'
              }

              cb()
            }, 0)
          })

          edgesBufferCounter = 0 
        }

    }

    // cy.add(edgesBuffer)
    q2.start()
  })
}


const button = document.createElement('button')
button.innerHTML = 'visit lag city'
button.style.position = 'absolute'
button.style.right = '0'
button.style.zIndex = '1000'
button.addEventListener('click', () => {
  const cose = cy.elements().makeLayout({name: 'cose'})
  cose.run()
  console.log('Started running cose layout...')
  console.log('This will take a while, about 4 stages:')
  console.log('Stage 1: nothing happens')
  console.log('Stage 2: blob')
  console.log('Stage 3: a different blob')
  console.log('Stage 4: a bunch of blobs')
})
document.body.appendChild(button)


// TODO css..
document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'

// Create and append container dom element
const containerDiv = document.createElement('div')
// containerDiv.id = 'cy'
containerDiv.style.height = '100%'
document.body.appendChild(containerDiv)

const cy = cytoscape({
  container: containerDiv, 

  elements: [ 
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
    }
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }
})
// TODO not end up depending on this by accident...
window.cy = cy
