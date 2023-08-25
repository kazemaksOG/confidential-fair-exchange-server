function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}


let full_encrypted_file;
let zipped_sub_files;
let zipped_sub_keys;
let smart_contract_id;
let random_seed;
let ring_signature;
let public_key_for_secret;

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    const smart_contract_id_query = document.URL.substring(document.URL.lastIndexOf('/') + 1);
    fetch("/api/get_post.json",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({smart_contract_id: smart_contract_id_query}),
        }
    )
        .then((response) => {
            if (response.status == 200) {
                response.json()
                    .then((data) => {
                        document.getElementById("post-title").textContent = data.title;
                        document.getElementById("description-text").textContent = data.document_description;
                        document.getElementById("smart-contract-id").textContent = data.smart_contract_id;
                        document.getElementById("price").textContent = data.price + " ETH";

                        document.getElementById("random-seed").textContent = data.random_seed;
                        document.getElementById("ring-signature").textContent = data.ring_signature;
                        document.getElementById("public-key-for-secret").textContent = data.public_key_for_secret;

                        let decoder = new TextDecoder("utf-8");
                        let buffer = new Uint8Array(data.full_encrypted_file.data);
                        let encrypted_text = decoder.decode(buffer);
                        full_encrypted_file = encrypted_text;

                        smart_contract_id = data.smart_contract_id;
                        random_seed = data.random_seed;
                        ring_signature = data.ring_signature;
                        public_key_for_secret = data.public_key_for_secret;

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

function copy_random_seed() {
    navigator.clipboard.writeText(random_seed);
}

function copy_ring_signature() {
    navigator.clipboard.writeText(ring_signature);
}

function copy_public_key_for_secret() {
    navigator.clipboard.writeText(public_key_for_secret);
}

function copy_full_encrypted_file() {
    navigator.clipboard.writeText(full_encrypted_file);
}


function download_full_encrypted_file() {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(full_encrypted_file));
    element.setAttribute('download', "encrypted_file_of_" + smart_contract_id + ".txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

async function download_sub_files() {


    const response = await fetch("/api/get_zipped_sub_files.zip",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({smart_contract_id: smart_contract_id}),
        })

    if (response.status == 200) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "zipped_sub_files.zip";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        console.error("Download failed");
    }

}

async function download_sub_keys() {


    const response = await fetch("/api/get_zipped_sub_keys.zip",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({smart_contract_id: smart_contract_id}),
        })

    if (response.status == 200) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "zipped_sub_keys.zip";
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        console.error("Download failed");
    }

}
