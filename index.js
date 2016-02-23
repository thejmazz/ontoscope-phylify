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

fetch(config.BASE_URL + '/ff-phase2-140729.obo').then( (response) => {
  if (response.status >= 400) {
      throw new Error('Bad response from server')
  }
    
  // TODO handle last 170 terms
  _(obo.terms( response.text() ))
    .each( (term) => {
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
