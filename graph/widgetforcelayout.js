require(
    ["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js",
    "widgets/js/widget"], function(d3, WidgetManager){ 

    var GraphView = IPython.DOMWidgetView.extend({

        render: function(){ 
//             this.$el.text(this.model.get('description'));
            this.guid = 'graph' + IPython.utils.uuid();
            this.setElement($('<div />', {id: this.guid}));
            console.log(this.guid);

            this.has_drawn = false;

            this.number = 0;

            this.model.on('change:value', this.value_changed, this);
            // this.model.on('change:charge', function(x) {console.log("charge")}, this);
//             this.model.on('change:link_distance', this.value_changed, this);
//             this.model.on('change:description', this.value_changed, this);
            
            // Wait for element to be added to the DOM            
            var that = this;
            setTimeout(function() {
                that.render_graph();
            }, 0);
            
        },
        
        render_graph: function() {
            console.log("render_graph");
            
            this.data = {'links': [], 'nodes': []};
            
            // this._update_data( {
            //         "nodes": [
            //             {"id":0, "name":"Myriel","group":1},
            //             {"id":1, "name":"Napoleon","group":1},
            //         ]
            //         ,
            //         "links": [
            //             {"source":1,"target":0,"value":10},
            //     ]});

            var width = this.model.get("width"),
                height = this.model.get("height");

            var that = this;
            this.force = d3.layout.force()
                          .size([width, height])
                          .nodes(this.data.nodes)
                          .links(this.data.links)
                          .linkDistance(100)
                          .charge(-90)
            .on("tick", function() { that.tick(); }); //that.tick);
            
            this.svg = d3.select("#" + this.guid)
                  .append("svg")
                   .attr('class', 'whatever')
                   .attr("width", this.model.get('width'))
                   .attr("height", this.model.get('height'));


            setTimeout(function() {
                that.update();
            }, 0.1);
        },
        
        _update_data: function(new_data) {
            function empty(a) {
                while(a.length > 0) { a.pop();};
            };
            empty(this.data.links);
            empty(this.data.nodes);
            
            function copy(a_old, a_new) {
                for (var i=0; i<a_new.length; i++) {a_old[i] = a_new[i];};
            };

            copy(this.data.links, new_data.links);
            copy(this.data.nodes, new_data.nodes);
        },
        
        _update_svg: function() {
            this.svg
                .attr("width", this.model.get('width'))
                .attr("height", this.model.get('height'));
        },
        
        _update_force: function() {
            var width = this.model.get("width"),
                height = this.model.get("height");
            
            var linkDistance = this.model.get("link_distance");
            var charge = this.model.get("charge");
            this.force.size([width, height])
                      .nodes(this.data.nodes) // initialize with a single node
                      .links(this.data.links) // initialize with a single node
                      .linkDistance(linkDistance)
                      .charge(charge);
        },

        start: function() {
            console.log("start");
            if (!this.has_drawn) {
                this.has_drawn = true;
                this.force.nodes(this.data.nodes).links(this.data.links);
                
                var node = this.svg.selectAll(".gnode"),
                    link = this.svg.selectAll(".link");
                
                var link = link.data(this.force.links(), function(d) { return d.source + "-" + d.target; });
                this._update_edge(link.enter().insert("line", ".link"))
                link.exit().remove();
                
                var node = node.data(this.force.nodes(), function(d) { return d.id;});
                node.exit().remove();

                var that = this;

                var node = node.enter()
                    .append("g")
                    .attr('class', 'gnode')
                this._update_circle(node.append("circle"));
                node.on("mouseover", function(d) {console.log(d);that._mouseover(this);})
                    .on("mouseout", function(d) {console.log(d);that._mouseout(this);});
                node.call(that.force.drag);

                this._update_text(node.append("text"));

                this.has_drawn = false;

                setTimeout(function() {
                    that.force.start();
                }, 0.1);
            }
//             

        },
        
        
        _update_circle: function(circle) {
            var that = this;

            circle
                .attr("id", function(d) { return that.guid + d.id; })
                .attr("class", function(d) { return "node " + d.id; })
                .attr("r", function(d) {
                    if (d.r == undefined) {
                        return 12; 
                    } else {
                        return d.r;
                    }
                    
                })
                .style("fill", function(d) {
                    if (d.fill == undefined) {
//                         return that.color(d.group);
                        return "blue";
                    } else {
                        return d.fill;
                    }
                    
                })
                .style("stroke", function(d) {
                    if (d.stroke == undefined) {
                        return "#FFF"; 
                    } else {
                        return d.stroke;
                    }
                    
                })
                .style("stroke-width", function(d) {
                    if (d.strokewidth == undefined) {
                        return "#FFF"; 
                    } else {
                        return d.strokewidth;
                    }
                    
                })
                .attr('dx', 0)
                .attr('dy', 0);
        },
        
        _update_edge: function(edge) {
            var that = this;
            edge
                .attr("id", function(d) { return that.guid + d.source.id + "-" + d.target.id; })
                .attr("class", "link")
                .style("stroke-width", function(d) {
                    if (d.strokewidth == undefined) {
                        return "1.5px"; 
                    } else {
                        return d.strokewidth;
                    }
                    
                })
                .style('stroke', function(d) {
                    if (d.stroke == undefined) {
                        return "#999"; 
                    } else {
                        return d.stroke;
                    }
                    
                });
        },

        update: function() {
            console.log("update");
            
            var that = this;
            setTimeout(function() {
                that.start();
            }, 0);

            return GraphView.__super__.update.apply(that);
        },

        _update_text: function(text) {
            var that = this;

            text
                .attr("id", function(d) { return that.guid + d.id + '-text'; })
                .text(function(d) { 
                    if (d.id) {
                        return  d.id;
                    } else {
                        return '';
                    }
                })
                .style("font-size",function(d) { 
                    if (d.font_size) {
                        return  d.font_size;
                    } else {
                        return '10pt';
                    }
                })
                .attr("text-anchor", "middle")
                .style("fill", function(d) { 
                    if (d.color) {
                        return  d.color;
                    } else {
                        return 'black';
                    }
                })
                .attr('dx', function(d) { 
                    if (d.dx) {
                        return  d.dx;
                    } else {
                        return 0;
                    }
                })
                .attr('dy', function(d) { 
                    if (d.dy) {
                        return  d.dy;
                    } else {
                        return 5;
                    }
                })
                .style("pointer-events", 'none');
        },
     
        tick: function() {
            var node = this.svg.selectAll(".gnode"),
                link = this.svg.selectAll(".link");
            
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            // Translate the groups
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  
        },


        _mouseover: function(node) {
            console.log("mouseover");
            d3.select(node).select(".node").transition()
              .duration(750)
              .attr("r", 16);
        },
 
        _mouseout: function (node) {
                        console.log("mouseout");

          d3.select(node).select(".node").transition()
              .duration(750)
              .attr("r", 8);
        },

        value_changed: function() {
            console.log("value_changed");
            var new_data = this.model.get("value");

            var that = this;
            setTimeout(function() {
                that._update_svg();
                that._update_data(new_data);
                that._update_force();
                that.start();
            }, 0.01);
        }

    });
    
    WidgetManager.register_widget_view('GraphView', GraphView);
});