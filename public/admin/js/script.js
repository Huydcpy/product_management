//Button status
console.log("products.js loaded")
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0){
    let url =new URL(window.location.href)
    buttonStatus.forEach(button =>{
        button.addEventListener("click",()=>{
            const status = button.getAttribute("button-status")
            console.log(status)

            if(status){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }
            console.log(url.href)
            window.location.href = url.href
        })
    })
}
//End Button Status


//Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
                url.searchParams.set("keyword",keyword);
            }else{
                url.searchParams.delete("keyword");
            }
            console.log(url.href)
            window.location.href = url.href
    })
}
//End Form Search


//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
    const url = new URL(window.location.href);
    buttonsPagination.forEach(button =>{
        button.addEventListener("click",()=>{
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page",page);
            window.location.href = url.href;
        })
    })
}

//end Pagination