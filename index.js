const http = require("http");
const host = '127.0.0.1';
const port = 8000;
const fs = require('fs').promises;

const image_location = "/public/img"
const css_location = "/public/css"
const js_location = "/public/js"


const dummy_posts = [
    {
        title: "CIA coup in Africa",
        description: "The U.S. government was determined to depose Nkrumah before he managed to unite Africa under one government, working with allies such as Great Britain and Canada to finance, mastermind, and guide the coup.[4] According to the U.S. State Department at the time, Nkrumah's overpowering desire to export his brand of nationalism unquestionably made Ghana one of the foremost practitioners of subversion in Africa.",
        smart_contract_id: "0x2131159ea8ffa3a706cc7041a75e152d7694e6b598e42e8fabf28306e9b5abd2",
        price: "1.123",
        hash_of_file: "asfdasfsdafasdgfasdgfasdgfasdgf",
    },
    {
        title: "CIA coup in Africa 2",
        description: "The U.S. government was determined to depose Nkrumah before he managed to unite Africa under one government, working with allies such as Great Britain and Canada to finance, mastermind, and guide the coup.[4] According to the U.S. State Department at the time, Nkrumah's overpowering desire to export his brand of nationalism unquestionably made Ghana one of the foremost practitioners of subversion in Africa.",
        smart_contract_id: "0x124124",
        price: "1.123",
        hash_of_file: "asfdasfsdafasdgfasdgfasdgfasdgf",
    }
]

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
                        res.writeHead(500);
                        res.end();
                    });
                break;
            case req.url.match(/\/post\//)?.input:
                fs.readFile(__dirname + "/public/post.html")
                    .then(contents => {
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(contents);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
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
                        res.writeHead(500);
                        res.end();
                    });
                break;
    
            case "/api/all_posts.json":
    
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(dummy_posts));
    
                break;
    
            case "/api/get_post.json":
                try  { 
                    const smart_contract_id = JSON.parse(data.toString()).smart_contract_id;
                    let res_post = null;
                    for(post of dummy_posts) {
                        if (post.smart_contract_id == smart_contract_id) {
                            res_post = post;
                        }
                    }

                    if(res_post != null) {
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200);
                        res.end(JSON.stringify(dummy_posts));
                    } else {
                        res.writeHead(404);
                        res.end();
                    }

                } catch(error) {
                    console.error(error);
                    res.writeHead(500);
                    res.end();
                }

                break;
            default:
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Resource not found" }));
        }
    });

}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
