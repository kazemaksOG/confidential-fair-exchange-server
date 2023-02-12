function transitionAfterPageLoad() {
    document.getElementById("body").classList.remove("no-transition");
}

window.addEventListener("load", (event) => {
    transitionAfterPageLoad();

    document.getElementById("input_hashed_file")
        .addEventListener("change", upload_hashed_file)
    document.getElementById("input_signature_file")
        .addEventListener("change", upload_signature_file)
});

let hashed_file_text = "";
let signature_file_text = "";


function publish() {
    document.getElementById("errors").innerHTML = "";
    document.getElementById("publish-button").disabled = true;
    let is_form_valid = true;

    const title = document.getElementById("title-of-post").value;
    const description = document.getElementById("description-of-post").value;
    const smart_contract_id = document.getElementById("id-of-post").value;
    const price = document.getElementById("price-of-post").value;

    if (title.length > 140) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Title is too long"
        document.getElementById("errors").appendChild(error)
    }
    if (title.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please enter a title"
        document.getElementById("errors").appendChild(error)
    }

    if (description.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please enter a description"
        document.getElementById("errors").appendChild(error)
    }
    if (smart_contract_id.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please enter a smart contract id"
        document.getElementById("errors").appendChild(error)
    }
    if (price.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please enter a price"
        document.getElementById("errors").appendChild(error)
    }
    if (signature_file_text.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please upload a non-empty signature file"
        document.getElementById("errors").appendChild(error)
    }
    if (hashed_file_text.length <= 0) {
        is_form_valid = false;
        const error = document.createElement("div");
        error.innerHTML = "Please upload a non-empty hashed file"
        document.getElementById("errors").appendChild(error)
    }

    if (is_form_valid) {
        fetch("/api/create_post",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    smart_contract_id,
                    price,
                    hash_of_file: hashed_file_text,
                    signature: signature_file_text,
                }),
            }
        )
            .then((response) => {
                if (response.status == 200) {
                    document.getElementById("server-response").innerHTML = "Post submitted, redirecting...";

                    window.setTimeout(function(){
                        window.location.href = "/";
                    }, 2000);

                } else {
                    response.json()
                        .then((data) => {
                            document.getElementById("server-response").innerHTML = data.response;
                            document.getElementById("publish-button").disabled = false;
                        })
                }
            })
    } else {
        document.getElementById("publish-button").disabled = false;
    }
}


function press_input_signature() {
    const file_element = document.getElementById("input_signature_file");
    file_element.click();
}

function upload_signature_file() {
    const file_element = document.getElementById("input_signature_file");

    if (file_element.files.length > 0) {
        if (file_element.files[0].type != "text/plain") {
            document.getElementById("upload_signature_file_confirm").innerHTML = "File is not .txt, please chose the correct format: ";
            return;
        }
        const reader = new FileReader();
        reader.onload = function (fileLoadedEvent) {
            const textFromFile = fileLoadedEvent.target.result;
            signature_file_text = textFromFile;
            document.getElementById("upload_signature_file_confirm").innerHTML = "Uploaded: " + file_element.files[0].name;
        }

        reader.readAsText(file_element.files[0], "UTF-8");
    }
}


function press_input_hashed() {
    const file_element = document.getElementById("input_hashed_file");

    file_element.click();
}

function upload_hashed_file() {
    const file_element = document.getElementById("input_hashed_file");
    if (file_element.files.length > 0) {
        if (file_element.files[0].type != "text/plain") {
            document.getElementById("upload_hashed_file_confirm").innerHTML = "File is not .txt, please chose the correct format: ";
            return;
        }
        const reader = new FileReader();
        reader.onload = function (fileLoadedEvent) {
            const textFromFile = fileLoadedEvent.target.result;
            hashed_file_text = textFromFile;
            document.getElementById("upload_hashed_file_confirm").innerHTML = "Uploaded: " + file_element.files[0].name;
        }

        reader.readAsText(file_element.files[0], "UTF-8");
    }
}