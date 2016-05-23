var assert = chai.assert;

describe("Noise generation", function () {
    it("Returnes same noise value for predefined seed", function () {
        var p = new Perlin();
        var expected = p.noise(9192, 818.53);
        assert.equal(p.noise(9192, 818.53), expected);
    });

    it("Returns equal noise values for same dimension valuess", function () {
        var p = new Perlin();
        var expected = p.noise(9123, 234.3);
        assert.notEqual(p.noise(234.3, 23423), expected);
    });

    it("returns different noise values after reseeding the noise", function () {
        var p = new Perlin();
        var expected = p.noise(1233, 234.4);
        p.noiseReseed(23411);
        assert.notEqual(p.noise(1233, 234.4), expected);
    });
    
    it("Returns equal noise values for same dimension values", function () {
        var p = new Perlin();
        var p2 = new Perlin();
        p.noiseReseed(343543);
        p2.noiseReseed(343543);
        var expected = p.noise(1.5, 1.5);
        var expected2 = p2.noise(1.5, 1.5);
        assert.equal(expected2, expected);
    });
});