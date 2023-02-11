function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    const smart_contract_id = document.URL.substring(document.URL.lastIndexOf('/') + 1);
    fetch("/api/get_post.json", 
    {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({smart_contract_id}),
    }
    )
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
  });
  