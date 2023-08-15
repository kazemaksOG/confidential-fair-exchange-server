# Confidential fair exchange server 
This repository contains the server that hosts the confidential fair exchange website, for sharing all the necessary information to perform a fare exchange between a seller and a buyer.

The server is expected to be hosted using TOR to introduce more privacy for the end users.

## Current features 
- An overview of every document in the database 
- Possibility to download/copy all the necessary data to enact a fair exchange protocol
- Create a post using the front end of the application 

## Backend
Backend is written in javascript and ran using `Node.js`. Node dependancies are kept to a minimum to avoid any future vulnerabilities.

## Database
The backend uses PostgreSQL as its database system. There is some setup necessary for it to work.

### Setup (Ubuntu)
1. Install psql following a guide. A guide for ubuntu [https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/)
2. Switch to psql user with 
```
sudo -i -u postgres 
```
3. Go into postgres CLI
```
psql
```
4. Create a database and a table
```SQL
CREATE DATABASE [DATABASE];
\c [DATABASE]
```

```SQL
CREATE TABLE [TABLE NAME] (
  smart_contract_id VARCHAR ( 200 ) PRIMARY KEY,
  title VARCHAR ( 240 ) NOT NULL,
  document_description VARCHAR ( 4000 ) NOT NULL,
  full_encrypted_file VARCHAR ( 10000000 ) NOT NULL,
  zipped_sub_files VARCHAR ( 10000000 ) NOT NULL,
  random_seed VARCHAR ( 400 ) NOT NULL,
  zipped_sub_keys VARCHAR ( 50000 ) NOT NULL,
  ring_signature VARCHAR ( 400 ) NOT NULL,
  price VARCHAR ( 200 ) NOT NULL,
  public_key_for_secret VARCHAR ( 200 ) NOT NULL
);
```

5. Create a user with appropriate privilages
```SQL
CREATE USER [USER] password '[PASSWORD]'
REVOKE ALL ON [TABLE NAME] FROM PUBLIC;
REVOKE ALL ON [TABLE NAME] FROM [USER];
GRANT SELECT, INSERT on [TABLE NAME]to [USER]
```

6. Modify config in `config.js`
```JS
const config = {
    user: "[USER]",
    password: "[PASSWORD]",
    host: "localhost",
    database: "[DATABASE]",
    port: 5432,
}
```


### Contents 
The database stores:
- the full encrypted file 
- contains all the encrypted subfiles
- random seed generated by the blockchain
- sampled keys published by the reporter
- ring signature 
- smart contract id 
- title
- description
- price 
- public key for encrypting the secret
  - secret being the padding used to encrypt/decrypt the key for confidential exchange



## TODO
- [ ] Implement ring signature checks, to only allow posts by trusted parties
  - [ ] find a trusted party to upkeep and assign these ringed signatures 
- [ ] Input validation (server side and client side)
- [ ] maybe add a feature that allows arranging exchange date(s), since fairdrop can only be done manually as of now and requires both parties to be present
- [ ] implement either server side hash validation/computations, or give clear instructions how to perform them to the buyers
- [ ] add a tutoral to the website, so reporters/news outlets know what steps are necessary for fair exchange.
- [ ] better serverside error handling (in case of sql error, like same smartID, too big document, etc)