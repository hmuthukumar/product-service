import { Get, JsonController, Param, OnUndefined } from 'routing-controllers';
import { logger } from '../../middleware/common/Logging';
import * as config from 'config';
import axios from 'axios';

export interface IProductData {
    id: string,
    product_type: string
}

@JsonController('/product')
export class ProductReviewController {

    constructor() {
    }
    /*
     API 1: get product review summary
    */
    @Get('/:productId')
    async getProductData(@Param("productId") productId: string): Promise<any> {
        var productData: any = {}, reviewData: any = {}
        try {
            let productDataResponse = await axios.get(config.get("productcatalogue") + "/" + productId);
            let productReviewData = await axios.get(config.get("productreview") + "/" + productId);

            if (productDataResponse && productDataResponse.status === 200) {
                console.log("dfd")
                productData = productDataResponse.data
            }
            if (productReviewData && productReviewData.status === 200) {
                console.log("dfd")
                reviewData = productReviewData.data
            }
            let result = { product: productData, reviews: reviewData }
            return result

        } catch (error) {
            logger.error(error);
            throw {
                message: "could not connect to data services, please try again later",
                status: 422
            };

        }
    }

}

