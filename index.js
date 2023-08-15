const config = require('./config.js').config;

const http = require("http");
const host = '127.0.0.1';
const port = 8000;
const fs = require('fs').promises;

const image_location = "/public/img"
const css_location = "/public/css"
const js_location = "/public/js"


const { Client } = require("pg");
const client = new Client(config);

const insert_query = "INSERT INTO document_table(title, description, smart_contract_id, price, hash_of_file) VALUES($1, $2, $3, $4, $5)";
const get_all_posts_query = "SELECT * FROM document_table";
const get_post_query = "SELECT * FROM document_table WHERE smart_contract_id = $1";

client.connect();

const requestListener = function (req, res) {

    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        const data = Buffer.concat(chunks);
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
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
                        res.end(JSON.stringify({ error: "Server error" }));
                    });
                break;

            case "/api/all_posts.json":

                client.query(get_all_posts_query, (query_error, query_result) => {
                    if (query_error) {
                        console.log(query_error.stack);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: "Server error" }));
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
                            res.end(JSON.stringify({ error: "Server error" }));
                        } else {
                            if (query_result.rows.length > 0) {
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(200);
                                res.end(JSON.stringify(query_result.rows[0]));
                            } else {
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(404);
                                res.end(JSON.stringify({ error: "Resource not found" }));
                            }

                        }
                    })


                } catch (error) {
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: "Server error" }));
                }

                break;
            case "/api/create_post":
                try {
                    // should check signature here
                    const data_json = JSON.parse(data.toString());


                    client.query(insert_query,
                        [
                            data_json.title,
                            data_json.description,
                            data_json.smart_contract_id,
                            data_json.price,
                            data_json.hash_of_file,
                        ],
                        (query_error, query_result) => {
                            if (query_error) {
                                console.log(query_error.stack);
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(500);
                                res.end(JSON.stringify({ error: "Server error" }));
                            } else {
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(200);
                                res.end(JSON.stringify({ response: "All good" }));
                            }
                        })

                } catch (error) {
                    console.error(error);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(400);
                    res.end(JSON.stringify({ response: "Bad request" }));
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
                            res.end(JSON.stringify({ error: "Server error" }));
                        });
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: "Resource not found" }));
                }

        }



    });

}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
