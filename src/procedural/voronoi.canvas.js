function start(seed) {
    window.seed = seed;
    window.alea_rand = new Alea(seed);
    window.iterations = 0;
    window.canvas = d3.select("canvas").node();
    window.context = canvas.getContext("2d");
    window.width = canvas.width;
    window.height = canvas.height;
    window.minVal = -1;
    window.maxVal = 801;

    window.sites = d3.range(400)
        .map(function (d) {
            return [window.alea_rand() * width, window.alea_rand() * height];
        });

    window.voronoi = d3.voronoi()
        .extent([
            [-1, -1],
            [width + 1, height + 1]
        ]);

    // window.diagram = voronoi(sites);
    // window.links = diagram.links();
    // window.polygons = diagram.polygons();
    // window.triangles = diagram.triangles();

    relax(sites);
}

function relax(points) {
    window.diagram = voronoi(points);
    window.polygons = diagram.polygons();
    centroids = polygons.map(d3.polygonCentroid);
    converged = points.every(function (point, i) {
        return distance(point, centroids[i]) < 1;
    });
    sites = points;
    if (iterations > 2) {
        // voronoi.extent(null);
        // window.triangles = voronoi.triangles(sites);
        window.links = voronoi.links(sites);
        draw();
    } else {
        setTimeout(function () {
            relax(centroids);
        }, 50);
    }
    window.iterations += 1;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function draw() {
    polygons.forEach(function (polygon) {
        context.beginPath();
        context.strokeStyle = "rgb(0, 0, 255)";
        context.fillStyle = "rgb(150,140,150)";
        context.moveTo(polygon[0][0], polygon[0][1]);

        if (polygon[0][0] == minVal || polygon[0][0] == maxVal || polygon[0][1] == minVal || polygon[0][1] == maxVal) {
            context.fillStyle = "rgb(0,255,255)";
        }

        polygon.slice(1).forEach(function (point) {
            if (point[0] == minVal || point[0] == maxVal || point[1] == minVal || point[1] == maxVal) {
                context.fillStyle = "rgb(0,255,255)";
            }
            context.lineTo(point[0], point[1]);
        });
        context.lineTo(polygon[0][0], polygon[0][1]);
        context.fill();
        context.stroke();
    });

    context.beginPath();
    context.strokeStyle = "rgba(255,0,0,0.3)";
    for (var i = 0, n = links.length; i < n; ++i) {
        var link = links[i];
        context.moveTo(link.source[0], link.source[1]);
        context.lineTo(link.target[0], link.target[1]);
    };
    context.stroke();

    // context.beginPath();
    // context.strokeStyle = "rgba(255, 0, 0, 0.2)";
    // triangles.forEach(function (triangle) {
    //     context.moveTo(triangle[0][0], triangle[0][1]);
    //     context.lineTo(triangle[1][0], triangle[1][1]);
    //     context.lineTo(triangle[2][0], triangle[2][1]);
    // });
    // context.stroke();

    context.beginPath();
    context.fillStyle = "rgb(0,0,0)";
    sites.forEach(function (point) {
        context.moveTo(point[0], point[1]);
        context.arc(point[0], point[1], 2, 0, 2 * Math.PI);
    });
    context.fill();
}