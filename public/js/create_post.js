function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    document.getElementById("input_full_encrypted_file")
        .addEventListener("change", upload_full_encrypted_file)
    document.getElementById("input_sub_files")
        .addEventListener("change", upload_sub_files)
    document.getElementById("input_keys")
        .addEventListener("change", upload_keys)

});

let full_encrypted_file;
let zipped_sub_files;
let zipped_sub_keys;


function publish() {
    document.getElementById("errors").textContent = "";
    let is_form_valid = true;

    const title = document.getElementById("title-of-post").value;
    const document_description = document.getElementById("description-of-post").value;
    const smart_contract_id = document.getElementById("id-of-post").value;
    const random_seed = document.getElementById("seed-of-post").value;
    const ring_signature = document.getElementById("ring-signature-of-post").value;
    const public_key_for_secret = document.getElementById("public-key-of-post").value;

    const price = document.getElementById("price-of-post").value;

    if (title.length > 140) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Title is too long"
        document.getElementById("errors").appendChild(error)
    }
    if (title.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a title"
        document.getElementById("errors").appendChild(error)
    }

    if (document_description.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a description"
        document.getElementById("errors").appendChild(error)
    }
    if (smart_contract_id.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a smart contract id"
        document.getElementById("errors").appendChild(error)
    }
    if (random_seed.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a random seed"
        document.getElementById("errors").appendChild(error)
    }
    if (ring_signature.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a ring signature"
        document.getElementById("errors").appendChild(error)
    }
    if (public_key_for_secret.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a public key"
        document.getElementById("errors").appendChild(error)
    }

    if (price.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please enter a price"
        document.getElementById("errors").appendChild(error)
    }
    if (full_encrypted_file.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please upload a non-empty full encrypted file"
        document.getElementById("errors").appendChild(error)
    }
    if (zipped_sub_files.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please upload a non-empty zip file of sub files"
        document.getElementById("errors").appendChild(error)
    }
    if (zipped_sub_keys.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.textContent = "Please upload a non-empty zip file of keys"
        document.getElementById("errors").appendChild(error)
    }


    if (is_form_valid) {
        const form_data = new FormData();
        // Add files
        form_data.append("zipped_sub_keys", zipped_sub_keys, "keys_" + smart_contract_id);
        form_data.append("zipped_sub_files", zipped_sub_files, "sub_files_" + smart_contract_id);
        // Add fields
        form_data.append("smart_contract_id", smart_contract_id);
        form_data.append("title", title);
        form_data.append("document_description", document_description);
        form_data.append("full_encrypted_file", full_encrypted_file);
        form_data.append("random_seed", random_seed);
        form_data.append("ring_signature", ring_signature);
        form_data.append("public_key_for_secret", public_key_for_secret);
        form_data.append("price", price);

        fetch("/api/create_post", {
            method: 'POST',
            body: form_data,
        })
            .then((response) => {
                if (response.status == 200) {
                    document.getElementById("server-response").textContent = "Post submitted, redirecting...";

                    window.setTimeout(function () {
                        window.location.href = "/";
                    }, 2000);

                } else {
                    console.log(response)
                    response.json()
                        .then((data) => {
                            document.getElementById("server-response").textContent = data.response;
                            document.getElementById("publish-button").disabled = false;
                        })
                }
            })

    } else {
        document.getElementById("publish-button").disabled = false;
    }
}


function press_input_full_encrypted_file() {
    const file_element = document.getElementById("input_full_encrypted_file");
    file_element.click();
}

function upload_full_encrypted_file() {
    const file_element = document.getElementById("input_full_encrypted_file");

    if (file_element.files.length > 0) {
        if (file_element.files[0].type != "text/plain") {
            document.getElementById("upload_full_encrypted_file_confirm").textContent = "File is not .txt, please chose the correct format: ";
            return;
        }
        const reader = new FileReader();
        reader.onload = function (fileLoadedEvent) {
            const textFromFile = fileLoadedEvent.target.result;
            full_encrypted_file = textFromFile;
            document.getElementById("upload_full_encrypted_file_confirm").textContent = "Uploaded: " + file_element.files[0].name;
        }

        reader.readAsText(file_element.files[0], "UTF-8");
    }
}


function press_input_sub_files() {
    const file_element = document.getElementById("input_sub_files");

    file_element.click();
}

function upload_sub_files() {
    const file_element = document.getElementById("input_sub_files");
    if (file_element.files.length > 0) {
        if (file_element.files[0].type != "application/zip") {
            document.getElementById("upload_sub_files_confirm").textContent = "File is not .zip, please chose the correct format: ";
            return;
        }
        zipped_sub_files = file_element.files[0];
        document.getElementById("upload_sub_files_confirm").textContent = "Uploaded: " + file_element.files[0].name;
    }
}

function press_input_keys() {
    const file_element = document.getElementById("input_keys");

    file_element.click();
}

function upload_keys() {
    const file_element = document.getElementById("input_keys");
    if (file_element.files.length > 0) {
        if (file_element.files[0].type != "application/zip") {
            document.getElementById("upload_keys_confirm").textContent = "File is not .zip, please chose the correct format: ";
            return;
        }
        zipped_sub_keys = file_element.files[0];
        document.getElementById("upload_keys_confirm").textContent = "Uploaded: " + file_element.files[0].name;

    }
}
