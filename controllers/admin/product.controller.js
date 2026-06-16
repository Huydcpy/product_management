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
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
         
        const status = req.params.status
        const id = req.params.id;
        await Product.updateOne({_id: id}, {status: status });
        res.redirect(req.get("Referrer") || "/");
        
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        switch (type) {
                case "active":
                        await Product.updateMany({_id: {$in :ids}},{status: "active"});
                        break;
                case "inactive":
                        await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
                        break;
                case "delete-all":
                        await Product.updateMany({_id: {$in: ids}}, {   
                                deleted: true,
                                deletedAt: new Date(),
                        });
                default:
                        break;
        }
        res.redirect(req.get("Referrer") || "/");
        
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req, res) => {
        const id = req.params.id;
        await Product.updateOne({_id: id},
                 {
                        deleted: true,
                        deletedAt: new Date()
                  
                 });
        res.redirect(req.get("Referrer") || "/");
}
