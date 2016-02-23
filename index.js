// Polyfills
require('es6-promise').polyfill()
require('isomorphic-fetch')

// Requires
const _ = require('highland')
const cytoscape = require('cytoscape')
const obo = require('bionode-obo')

let terms = []
let total = 0

// let smallerTerms

fetch('/ff-phase2-140729.obo').then( (response) => {
  if (response.status >= 400) {
      throw new Error('Bad response from server');
  }
    
  _(obo.terms(_(response.text())))
    .each( (term) => {
      // console.log(term)
      // terms.push({data: {id: term.id}})
      // console.log(terms)
      if (terms.length <= 500) {
        terms.push({data: {id: term.id}})
      }
      
      if (terms.length === 500) {
        // console.log(terms)
        console.log(total)
        total += terms.length

        cy.add(terms)
        let layout = window.cy.elements().makeLayout({name: 'grid'})
        layout.run()

        terms = []
      }
    })
    .done( () => console.log('done') )
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

window.cy.add({data: { id: 'c' } })
window.cy.add({data: { id: 'd'} })
let layout = window.cy.elements().makeLayout({name: 'grid'})
layout.run()
