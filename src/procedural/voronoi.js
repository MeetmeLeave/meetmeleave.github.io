class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class DelaunayNode {

}

class VoronoiNode {

}

class DelaunayTriangulation {

}

class VoronoiDiagram {
    constructor(seed, amountOfPoints, amountOfRelaxations) {
        this.voronoiNodes = [];
        this.seed = seed;
        this.amountOfPoints = amountOfPoints;
        this.amountOfRelaxations = amountOfRelaxations;
        this.alea_rand = new Alea(this.seed);

        generateDiagram();
    }

    generateDiagram() {
        // 1. generate random Euclidean space points
        let points = generatePoints();

        // 2. Build triangulation
        // 3. Build Voronoi
        // 4. Apply relaxation
    }

    generatePoints() {
        let points = [];

        for (let i = 0; i < this.amountOfPoints; i++) {
            let point = new Point2D(this.alea_rand(), this.alea_rand());
            points.push(point);
        }

        return points;
    }
}