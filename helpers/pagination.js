module.exports = (req, objectPagination) => {
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    return objectPagination;
}
