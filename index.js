const config = require('./config.js').config;
const table_name = require('./config.js').table_name;

const http = require("http");
const host = '127.0.0.1';
const port = 8000;
const fs = require('fs').promises;
const fs_sync = require('fs');

const image_location = "/public/img"
const css_location = "/public/css"
const formidable = require("formidable");
const js_location = "/public/js"
const file_storage_location = "/files"

// Create storage folder for local files
if (!fs_sync.existsSync(__dirname + file_storage_location)) {
    fs_sync.mkdirSync(__dirname + file_storage_location);
}


const {Client} = require("pg");
const client = new Client(config);

// Pre defined queries to avoid sql injection 
const insert_query = `INSERT INTO ${table_name}(smart_contract_id, title, document_description, full_encrypted_file, random_seed, ring_signature, price, public_key_for_secret) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
const get_all_posts_query = `SELECT * FROM ${table_name}`;
const get_post_query = `SELECT * FROM ${table_name} WHERE smart_contract_id = $1`;

client.connect();

const requestListener = function (req, res) {

    // Check for file upload 
    if (req.method === "POST" && req.url === "/api/create_post") {

        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {

            if (err) {
                console.error("Error parsing form data", err);
                res.writeHead(500);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({error: "Internal server error: can't read form data"}));
            }
            //should do the ring signature check here
            const zipped_sub_files = files.zipped_sub_files[0];
            const zipped_sub_keys = files.zipped_sub_keys[0];

            const smart_contract_id = fields.smart_contract_id[0];
            const title = fields.title[0];
            const document_description = fields.document_description[0];
            const full_encrypted_file = fields.full_encrypted_file[0];
            const random_seed = fields.random_seed[0];
            const ring_signature = fields.ring_signature[0];
            const public_key_for_secret = fields.public_key_for_secret[0];
            const price = fields.price[0];

            const file_directory = __dirname + file_storage_location + "/" + smart_contract_id;

            // create a subfolder to store zipped files
            if (!fs_sync.existsSync(file_directory)) {
                fs_sync.mkdirSync(file_directory);
            }

            // Save files under their smart contract ID, since it should be unique
            fs_sync.rename(zipped_sub_files.filepath, file_directory + "/sub_files.zip", err => {
                if (err) {
                    console.error("Error moving/saving zipped sub files", err);
                    res.writeHead(500);
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({error: "Internal server error: can't save sub files"}));
                    return;
                }

                fs_sync.rename(zipped_sub_keys.filepath, file_directory + "/sub_keys.zip", err => {
                    if (err) {
                        console.error("Error moving/saving zipped sub files", err);
                        res.writeHead(500);
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({error: "Internal server error: can't save sub keys"}));
                        return;
                    }

                    // Upload rest of the data to db
                    try {
                        client.query(insert_query,
                            [
                                smart_contract_id,
                                title,
                                document_description,
                                full_encrypted_file,
                                random_seed,
                                ring_signature,
                                price,
                                public_key_for_secret,
                            ],
                            (query_error, query_result) => {
                                if (query_error) {
                                    console.log(query_error.stack);
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(500);
                                    res.end(JSON.stringify({error: "Server error"}));
                                } else {
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(200);
                                    res.end(JSON.stringify({response: "All good"}));
                                }
                            })

                    } catch (error) {
                        console.error(error);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(400);
                        res.end(JSON.stringify({response: "Bad request"}));
                    }

                });
            });
        });

    } else {
        // Handle normal request 
        const chunks = [];
        req.on("data", (chunk) => {
            chunks.push(chunk);
        });
        req.on("end", () => {
            const data = Buffer.concat(chunks);

            // Match on URL
            switch (req.url) {
                case "/":
                    fs.readFile(__dirname + "/public/main.html")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/html");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;
                case "/create_post":
                    fs.readFile(__dirname + "/public/create_post.html")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/html");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;

                case "/logo.svg":
                    fs.readFile(__dirname + image_location + "/logo.svg")
                        .then(contents => {
                            res.setHeader("Content-Type", "image/svg+xml");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;

                case "/main.css":
                    fs.readFile(__dirname + css_location + "/main.css")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/css");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;

                case "/post.css":
                    fs.readFile(__dirname + css_location + "/post.css")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/css");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;
                case "/create_post.css":
                    fs.readFile(__dirname + css_location + "/create_post.css")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/css");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;
                case "/common.css":
                    fs.readFile(__dirname + css_location + "/common.css")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/css");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;
                case "/main.js":
                    fs.readFile(__dirname + js_location + "/main.js")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/javascript");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;
                case "/post.js":
                    fs.readFile(__dirname + js_location + "/post.js")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/javascript");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;

                case "/create_post.js":
                    fs.readFile(__dirname + js_location + "/create_post.js")
                        .then(contents => {
                            res.setHeader("Content-Type", "text/javascript");
                            res.writeHead(200);
                            res.end(contents);
                        })
                        .catch(err => {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        });
                    break;

                case "/api/all_posts.json":

                    client.query(get_all_posts_query, (query_error, query_result) => {
                        if (query_error) {
                            console.log(query_error.stack);
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(500);
                            res.end(JSON.stringify({error: "Server error"}));
                        } else {
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(200);
                            res.end(JSON.stringify(query_result.rows));
                        }
                    })

                    break;

                case "/api/get_post.json":
                    try {
                        const smart_contract_id = JSON.parse(data.toString()).smart_contract_id;

                        client.query(get_post_query, [smart_contract_id], (query_error, query_result) => {
                            if (query_error) {
                                console.log(query_error.stack);
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(500);
                                res.end(JSON.stringify({error: "Server error"}));
                            } else {
                                if (query_result.rows.length > 0) {
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(200);
                                    res.end(JSON.stringify(query_result.rows[0]));
                                } else {
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(404);
                                    res.end(JSON.stringify({error: "Resource not found"}));
                                }

                            }
                        })


                    } catch (error) {
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(500);
                        res.end(JSON.stringify({error: "Server error"}));
                    }

                    break;
                case "/api/get_zipped_sub_keys.zip":
                    try {
                        const smart_contract_id = JSON.parse(data.toString()).smart_contract_id;

                        client.query(get_post_query, [smart_contract_id], (query_error, query_result) => {
                            if (query_error) {
                                console.log(query_error.stack);
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(500);
                                res.end(JSON.stringify({error: "Server error"}));
                            } else {
                                if (query_result.rows.length > 0) {
                                    const file_path = __dirname + file_storage_location + "/" + smart_contract_id + "/sub_keys.zip";
                                    const stat = fs_sync.statSync(file_path);
                                    res.writeHead(200, {
                                        "Content-Disposition": `attachment; filename=file.zip`,
                                        "Content-Length": stat.size,
                                        "Content-Type": "application/zip",
                                    });
                                    const file_stream = fs_sync.createReadStream(file_path);
                                    file_stream.pipe(res);
                                } else {
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(404);
                                    res.end(JSON.stringify({error: "Resource not found"}));
                                }

                            }
                        })


                    } catch (error) {
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(500);
                        res.end(JSON.stringify({error: "Server error"}));
                    }

                    break;

                case "/api/get_zipped_sub_files.zip":
                    try {
                        const smart_contract_id = JSON.parse(data.toString()).smart_contract_id;

                        client.query(get_post_query, [smart_contract_id], (query_error, query_result) => {
                            if (query_error) {
                                console.log(query_error.stack);
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(500);
                                res.end(JSON.stringify({error: "Server error"}));
                            } else {
                                if (query_result.rows.length > 0) {
                                    const file_path = __dirname + file_storage_location + "/" + smart_contract_id + "/sub_files.zip";
                                    const stat = fs_sync.statSync(file_path);
                                    res.writeHead(200, {
                                        "Content-Disposition": `attachment; filename=file.zip`,
                                        "Content-Length": stat.size,
                                        "Content-Type": "application/zip",
                                    });
                                    const file_stream = fs_sync.createReadStream(file_path);
                                    file_stream.pipe(res);
                                } else {
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(404);
                                    res.end(JSON.stringify({error: "Resource not found"}));
                                }

                            }
                        })


                    } catch (error) {
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(500);
                        res.end(JSON.stringify({error: "Server error"}));
                    }

                    break;


                default:
                    // dynamic link case
                    const post_link = req.url.match(/\/post\/0x[0123456789abcdef]{64}/);

                    if (post_link != null && post_link[0] === req.url) {
                        fs.readFile(__dirname + "/public/post.html")
                            .then(contents => {
                                res.setHeader("Content-Type", "text/html");
                                res.writeHead(200);
                                res.end(contents);
                            })
                            .catch(err => {
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(500);
                                res.end(JSON.stringify({error: "Server error"}));
                            });
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(404);
                        res.end(JSON.stringify({error: "Resource not found"}));
                    }

            }




        });
    }

}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
