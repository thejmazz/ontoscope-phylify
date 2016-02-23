// Polyfills
require('es6-promise').polyfill()
require('isomorphic-fetch')

// Requires
const _ = require('highland')
const cytoscape = require('cytoscape')
const queue = require('queue')
const obo = require('bionode-obo')

// const q = queue({concurrency: 40})
// const TIMEOUT = 0 
// console.log(`Its gonna take ${(6170*TIMEOUT) / 1000 / 60} minutes`)
// let terms = []
// let total = 0
// let compl = 0

const startTime = Date.now()
console.log(startTime)

// q.start()

// let smallerTerms

// Buffer of terms
const TERMS_BUFFER_SIZE = 200
let termsBufferIndex = 0
let termsBuffer = []
let chunks = 0
// Queue
const q = queue({concurrency: 1})
// Temp counter until 'eventedness' in parser is resolved
let total = 0


const adderCreator = (chunks) => {
  return (cb) => {
    setTimeout( () => {
      console.log(chunks*TERMS_BUFFER_SIZE)
    }, 5)
  }
}

fetch('/ff-phase2-140729.obo').then( (response) => {
  if (response.status >= 400) {
      throw new Error('Bad response from server')
  }
    
  _(obo.terms( response.text() ))
    .each( (term) => {
      termsBuffer[termsBufferIndex] = {data: {id: term.id}}
      termsBufferIndex++

      if (termsBufferIndex === TERMS_BUFFER_SIZE) {
        // Buffer filled, use it 
        console.log(chunks*TERMS_BUFFER_SIZE)
       
        // q.push(adderCreator(chunks))
        
        // setTimeout( () => {
        //   // console.log(chunks*TERMS_BUFFER_SIZE)
        //   console.log(term.id)
        // }, 0)

        q.push( (cb) => {
          setTimeout( () => {
            const sTime = Date.now()
            cy.add(termsBuffer)
            const delta = Date.now() - sTime
            console.log(`Added chunk of ${termsBuffer.length} vertices in ${delta} ms`)
            cb()
          }, 5)  
        })

        // Increment our chunks counter
        chunks++


        // and restart
        termsBufferIndex = 0
        termsBuffer = []
      }

      if (total === 6000) {
        console.log('did 6000')
        q.start()
      }
      total++
    })
    // .each( (term) => {
    //   q.push( (cb) => {
    //     setTimeout( () => {
    //       // console.log(compl++)
    //       compl++
    //       if (compl === 6000) {
    //         const delta = Date.now() - startTime
    //         console.log(delta / 1000 / 60)
    //       }
    //
    //       console.log('did one')
    //       cy.add({data: {id: term.id}})
    //       if (compl % 500 === 0) {
    //         let layout = window.cy.elements().makeLayout({name: 'grid'})
    //         layout.run()
    //       }
    //       cb()
    //     }, TIMEOUT )
    //   } )
    //   total += 1
    //   // console.log(total)
    //   if (total === 6170) {
    //     console.log('gonna start')
    //     q.start()
    //   }
    // } )
    // .each( (term) => {
    //   // console.log(term)
    //   // terms.push({data: {id: term.id}})
    //   // console.log(terms)
    //   if (terms.length <= 500) {
    //     terms.push({data: {id: term.id}})
    //   }
    //
    //   if (terms.length === 500) {
    //     // console.log(terms)
    //     console.log(total)
    //     total += terms.length
    //
    //     cy.add(terms)
    //     let layout = window.cy.elements().makeLayout({name: 'grid'})
    //     layout.run()
    //
    //     terms = []
    //   }
    // }) 
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
window.cy = cy


let layout = window.cy.elements().makeLayout({name: 'grid'})
layout.run()
