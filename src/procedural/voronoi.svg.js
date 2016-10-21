function start(seed) {
    window.seed = seed;
    window.alea_rand = new Alea(seed);
    window.iterations = 0;

    window.svg = d3.select("svg");
    window.width = +svg.attr("width");
    window.height = +svg.attr("height");

    window.sites = d3.range(300)
        .map(function (d) {
            return [window.alea_rand() * width, window.alea_rand() * height];
        });

    window.voronoi = d3.voronoi()
        .extent([
            [-1, -1],
            [width + 1, height + 1]
        ]);

    relax(sites);
}

function relax(points) {
    var diagram = voronoi(points);
    var polygons = diagram.polygons();
    var centroids = polygons.map(d3.polygonCentroid);
    var converged = points.every(function (point, i) {
        return distance(point, centroids[i]) < 1;
    });

    if (iterations > 2) {
        sites = points;
        window.links = diagram.links();
        window.polygons = diagram.polygons();

        // voronoi.extent(null);
        draw();
    } else {
        setTimeout(function () {
            relax(centroids);
        }, 50);
    }
    window.iterations += 1;
}

function draw() {
    window.polygon = svg.append("g")
        .attr("class", "polygons")
        .selectAll("path")
        .data(polygons)
        .enter().append("path")
        .call(redrawPolygon);

    window.link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .call(redrawLink);

    window.site = svg.append("g")
        .attr("class", "sites")
        .selectAll("circle")
        .data(sites)
        .enter().append("circle")
        .attr("r", 2.5)
        .call(redrawSite);
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function redrawPolygon(polygon) {
    polygon
        .attr("d", function (d) {
            return d ? "M" + d.join("L") + "Z" : null;
        });
}

function redrawLink(link) {
    link
        .attr("x1", function (d) {
            return d.source[0];
        })
        .attr("y1", function (d) {
            return d.source[1];
        })
        .attr("x2", function (d) {
            return d.target[0];
        })
        .attr("y2", function (d) {
            return d.target[1];
        });
}

function redrawSite(site) {
    site
        .attr("cx", function (d) {
            return d[0];
        })
        .attr("cy", function (d) {
            return d[1];
        });
}