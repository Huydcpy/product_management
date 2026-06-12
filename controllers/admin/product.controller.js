//[GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const SearchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
module.exports.index = async(req, res) => {
        const filterStatus = filterStatusHelper(req.query)
        
        console.log(filterStatus)
        let find = {
                deleted: false

        };
        if(req.query.status){
                find.status = req.query.status;   
        }
        //Tim kiem
        const objectSearch = SearchHelper(req.query)
        
        if(objectSearch.regex){
                find.title = objectSearch.regex;
        }

        let objectPagination = {
                currentPage: 1,
                limitItems: 4
        };
       
        objectPagination = paginationHelper(req, objectPagination)
        
        const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
        const countProducts = await Product.countDocuments(find);
        const totalPage = Math.ceil(countProducts/4);
        objectPagination.totalPage = totalPage;


        console.log(objectPagination.totalPage)
        res.render("admin/pages/products/index",{
                pageTitle: "Danh sách sản phẩm",
                products: products,
                filterStatus: filterStatus,
                keyword: objectSearch.keyword,
                pagination:objectPagination
        });
}