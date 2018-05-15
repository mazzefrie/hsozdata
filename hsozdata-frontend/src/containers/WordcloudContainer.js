import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { max }  from 'd3-array'
import { select } from 'd3-selection'
import cloud from 'd3-cloud';


class WordcloudContainer extends Component {
   constructor(props){
      super(props)
      this.createBarChart = this.createBarChart.bind(this)

   }
   componentDidUpdate() {
      this.createBarChart()
   }

   createBarChart() {
      const node = this.node;

      var layout = cloud().size([500, 800])
       .words(       this.props.data.map(function(d) {
         return {text: d.id, size: d.model*200, color:'#3498DB'}
       })  )
       .padding(5)
       .rotate(function() { return ~~(Math.random() * 2) * 90; })
       .font("Impact")
       .fontSize(function(d) { return d.size; })
       .on("end", function (xword) {

         select(node)
          .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(xword)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      });
       layout.start();


   }
   render() {
      return <svg ref={node => this.node = node}
      width={500} height={800}>
      </svg>
   }
}
export default WordcloudContainer;