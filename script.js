const apiKey = "Sv9jmrVfRCpP0yQDelbZHwBHNmps3G3MXm1fZiqnpx3voK0eausr09aU"
const perPage = 15;
let currentPage = 1;

let images = document.querySelector(".images");
let load = document.querySelector(".load-more");
let search = document.querySelector(".search-box input");
let lightBox = document.querySelector(".lightbox");
let closeBtn = document.querySelector(".uil-times")
let downloadBtn = lightBox.querySelector(".uil-import");
let searchTerm = null;

const downloadImg = (imgUrl) =>{
    fetch(imgUrl)
    .then((res)=>{
        return res.blob()
    })
    .then((data)=>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(data);
        a.download = new Date().getTime();
        a.click();
    }).catch(()=>{
        alert("Failed to download Image!");
    })
} 

const hideLightBox = () => {
    document.body.style.overflow = "auto";
    lightBox.classList.remove("show");

}

const lightBoxShow = (name, img) =>{
    lightBox.classList.add("show");
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadBtn.setAttribute("data-img", img);4
    document.body.style.overflow = "hidden";
}

const generateHtml = (photos) =>
{   
    // console.log(photos);
    images.innerHTML+= photos.map(photo =>
        `<li class="card" onclick="lightBoxShow('${photo.photographer}','${photo.src.large2x}' )">
                <img src=${photo.src.large2x} alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span id="name" >${photo.photographer}</span>
                    </div>
                    <button onclick = "downloadImg('${photo.src.large2x}'); event.stopPropagation();"><i class="uil uil-import"></i></button>
                </div>
            </li>`
    ).join("");
}

const getImages = (apiUrl) =>{

    load.innerText = "Loading...";
    load.classList.add("disabled");

    fetch(apiUrl, {
        headers: {Authorization: apiKey}
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        generateHtml(data.photos);
        load.innerText = "Load More";
        load.classList.remove("disabled");
    }).catch(()=>{
        alert("Failed to Load Images!");
    })
}

const loadImagesMore = ()=>{
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
}

const loadSearchImages = (e) => {
    if(e.key === "Enter")
    {
        currentPage = 1;
        images.innerHTML = "";
        searchTerm = e.target.value;
        if(searchTerm == "")
        {
            getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
        }
        else{
            getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
        }
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
load.addEventListener("click",loadImagesMore);
search.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadBtn.addEventListener("click", (e)=> downloadImg(e.target.dataset.img));