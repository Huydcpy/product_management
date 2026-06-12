module.exports = () =>{
     if (req.query.page){
                    objectPagination.currentPage = parseInt(req.query.page);
            }
            objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems
            
            const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
            const countProducts = await Product.countDocuments(find);
            const totalPage = Math.ceil(countProducts/4);
            objectPagination.totalPage = totalPage;
    
}