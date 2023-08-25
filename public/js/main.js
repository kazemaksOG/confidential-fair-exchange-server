// Fixes transition on startup bug
function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    fetch("/api/all_posts.json")
    .then((response) => response.json())
    .then((data) => {
        for(post_data of data) {
            const post = document.createElement("a");
            post.className = "post";
            const post_info = document.createElement("div");
            post_info.className = "post-info";
            const post_title = document.createElement("div");
            post_title.className = "post-title";
            const post_description = document.createElement("div");
            post_description.className = "post-description";
            const post_price = document.createElement("div");
            post_price.className = "post-price";

            post_title.textContent = post_data.title;
            post_description.textContent = post_data.document_description;
            post_price.textContent = post_data.price + " ETH";
            post.href = "/post/" + post_data.smart_contract_id;

            post_info.appendChild(post_title);
            post_info.appendChild(post_description);
            post.appendChild(post_info);
            post.appendChild(post_price);
            document.getElementById("posts").appendChild(post);
        }
    });

  });
  
