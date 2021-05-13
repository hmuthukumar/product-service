import { Get, JsonController, Param, OnUndefined } from 'routing-controllers';
import { logger } from '../../middleware/common/Logging';
import * as config from 'config';
import axios from 'axios';
import { AxiosApi } from '@etsoo/restclient';
import { stat } from 'fs';

export interface IProductData {
    id: string,
    product_type: string
}

@JsonController('/product')
export class ProductAggregationController {

    constructor() {
    }
    /*
     API 1: get product data and review summary aggregation
    */
    @Get('/:productId')
    @OnUndefined(404)
    async getProductData(@Param("productId") productId: string): Promise<any> {
        //Initializing result to null when no data set in result HTTP 404 will be returned
        var result = undefined
        try {
            let productDataResponse = await axios.get(
                config.get("productcatalogue") + "/" + productId,
                {
                    validateStatus: function (status) { if (status === 404 || status === 200) return true }
                });
            // Setting product data result from the live API
            if (productDataResponse && productDataResponse.status === 200) {
                result = { product: productDataResponse.data }
                //Proceeding to get the product review data from product-review-service
                let productReviewData = await axios.get(config.get("productreview") + "/" + productId,
                    {
                        validateStatus: function (status) { if (status === 404 || status === 200) return true }
                    });
                //Setting the review data from product-review-service
                if (productReviewData && productReviewData.status === 200) {
                    result.reviews = productReviewData.data
                }
            } 
            return result

        } catch (err) {
            throw {
                message: "could not connect to data services, please try again later",
                status: 422
            };

        }
    }

}

