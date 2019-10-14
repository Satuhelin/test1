import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([1860, 2018])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 550000])
  .range([height, 0])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.people)
  })

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `${d.year} <span style='color:red'>${d.people}</span>`
  })
svg.call(tip)

d3.csv(require('../data/filippiinidata_spread 4.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  // Draw your dots
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', 'orange')
    .attr('r', '5')
    .attr('cx', d => {
      return xPositionScale(d.year)
    })
    .attr('cy', d => {
      return yPositionScale(d.people)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Draw your single
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('stroke', 'orange')
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')

  const annotations = [
    {
      note: {
        label: '',
        title: 'Independence and War Brides Act'
      },
      // copy what our data looks like
      // this is the point i want to annotate
      data: { year: '1949', people: '4099' },
      connector: { end: 'arrow' },
      dx: -50,
      dy: -20,
      color: 'black'
    },

    {
      type: d3Annotation.annotationCallout,
      note: {
        label: '',

        title: 'China overpasses the Philippines in the numbers of migrants'
      },
      data: { year: '1999', people: 534338 },
      connector: { end: 'arrow' },

      dy: 80,
      dx: -100,
      color: 'black'
    },

    {
      type: d3Annotation.annotationCallout,
      note: {
        label: 'Ramon Reyes Lala 1898',

        title: 'First Filipino gets a citizenship'
      },
      data: { year: '1898', people: 19 },
      connector: { end: 'arrow' },

      dy: -40,
      dx: -30,
      color: 'black'
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.year),
      y: d => yPositionScale(d.people)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  // Add your axes

  svg
    .append('text')
    .text('Filippino migration to the U.S 1860-2018')
    .attr('x', width / 2)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .attr('font-size', 22)

  const yAxis = d3.axisLeft(yPositionScale).ticks(7)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    .ticks(7)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
