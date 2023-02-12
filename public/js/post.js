function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}

let hash_of_file;
let smart_contract_id;

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    const smart_contract_id_query = document.URL.substring(document.URL.lastIndexOf('/') + 1);
    fetch("/api/get_post.json",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ smart_contract_id: smart_contract_id_query }),
        }
    )
        .then((response) => {
            if (response.status == 200) {
                response.json()
                    .then((data) => {
                        document.getElementById("post-title").innerHTML = data.title;
                        document.getElementById("description-text").innerHTML = data.description;
                        document.getElementById("smart-contract-id").innerHTML = data.smart_contract_id;
                        document.getElementById("price").innerHTML = data.price + " ETH";

                        hash_of_file = data.hash_of_file;
                        smart_contract_id = data.smart_contract_id;

                        document.getElementById("post").classList.remove("hide");
                    })
            } else {
                response.json()
                    .then((data) => {
                        alert("Error: " + data.error);
                    })
            }
        })

});

function copy_smart_contract_id() {
    navigator.clipboard.writeText(smart_contract_id);
}

function copy_hash() {
    navigator.clipboard.writeText(hash_of_file);
}

function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(hash_of_file));
    element.setAttribute('download', "hash_of_" + smart_contract_id + ".txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}