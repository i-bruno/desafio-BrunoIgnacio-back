import productsModel from "../models/products.model.js";


export default class ProductsService {

    getAll = async ({ query, options }) => {
        const result = await productsModel.paginate(query, options);
        return {
            docs: result.docs.map(item => item.toObject()),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink,
            }
        }
    }


    save = async (item) => {
        let result = await productsModel.create(item);
        return result;
    }
    countItems = async () => {
        let result = await productsModel.countDocuments();
        return result;
    }

    matchItems = async (a) => {
        let result = await productsModel.aggregate([

            {
                $match: { size: a }
            }

        ])
        return result;
    }

    groupItems = async () => {
        let result = await productsModel.aggregate([

            {
                $group: { _id: "$size", totalQty: { $sum: "$stock" } }
            }

        ])
        return result;
    }


}