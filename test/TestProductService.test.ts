import * as request from 'supertest';
import app from '../dist/Index'
import * as assert from 'assert';


const apptest = request(app.server);

describe("GET a non existing product /product/AB0000", () => {
    it("should return 404 ", async () => {
         return apptest.get("/product/AB0000")
            .expect(404)
    });
});

describe("GET an existing product but no review summary /product/GN3500", () => {
    it("should return 200", async () => { 
         return apptest.get("/product/GN3500")
            .expect(200)
            .then( response => {
                let productAggregate = JSON.parse(response.text)
                assert(productAggregate.product.name === 'Adicolor Classics 3-Stripes T-Shirt',"Product name not matching")
                assert(productAggregate.reviews === undefined, "Review summary data must be empty")
            })
    });
}); 

describe("GET an existing product with review summary /product/C77154", () => {
    it("should return 200", async () => { 
         return apptest.get("/product/C77154")
            .expect(200)
            .then( response => {
                let productAggregate = JSON.parse(response.text)
                assert(productAggregate.product.name === 'Superstar Shoes', "Product name not matching")
                assert(productAggregate.reviews !== undefined, "There should be some data in review summary")
            });
    });
});




