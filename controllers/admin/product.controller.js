//[GET] /admin/products
const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const SearchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")
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
        
        let products = await Product.find(find).sort({ position: 1 }).limit(objectPagination.limitItems).skip(objectPagination.skip).lean();
        products = products.map(product => ({
                ...product,
                id: String(product._id)
        }));
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
        req.flash("success", "Cap nhat trang thai thanh cong")
        res.redirect(req.get("Referrer") || "/");
        
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        switch (type) {
                case "active":
                        await Product.updateMany({_id: {$in :ids}},{status: "active"});
                        req.flash("success", `Cap nhat trang thai thanh cong cua ${ids.length} san pham`);
                        break;
                case "inactive":
                        await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
                        req.flash("success", `Cap nhat trang thai thanh cong cua ${ids.length} san pham`);
                        break;
                case "delete-all":
                        await Product.updateMany({_id: {$in: ids}}, {   
                                deleted: true,
                                deletedAt: new Date(),
                        });
                        break;
                case "change-position":
                        for (const item of ids){
                                let [id, position] = item.split("-");
                                position = parseInt(position)
                                if(isNaN(position)){
                                        continue;
                                }
                                await Product.updateOne({_id: id},{
                                        position: position
                                })
                        }
                        break;
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
        req.flash("success", `Đã xóa thành công sản phẩm`);
        res.redirect(req.get("Referrer") || "/");
}
//[GET] /admin/products/create
module.exports.create = async(req, res) =>{
        res.render("admin/pages/products/create")
}
module.exports.createPost = async(req, res) =>{
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if(req.body.position == ""){
                const countProducts = await Product.countDocuments();
                req.body.position = countProducts + 1;
        }
        else{
                req.body.position = parseInt(req.body.position)
        }
        const product = new Product(req.body);
        await product.save();
        req.flash("success", "Tạo sản phẩm thành công")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
        console.log(req.body)
}