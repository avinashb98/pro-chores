# Pro-Chores

> **Service Experts Discovery Platform API**

The **Pro-Chores** exposes a [JSON:API Spec](http://jsonapi.org/) Compliant `REST API` that can be used by external services to build a service expert discovery platform.

**API Documentation:**
-  A postman collection of the API requests is available at https://documenter.getpostman.com/view/2815732/RzthSX2y

**Postman Collection:**
- Postman collection for the API is available at
https://www.getpostman.com/collections/ba28c9a6601d2f3903a8

## Technology Stack
* Database - [MongoDB](https://www.mongodb.org/)
* ORM - [Mongoose](https://mongoosejs.com)
* Runtime - [Nodejs](https://nodejs.org/en/)
* App server - [express](https://expressjs.com/)

### Installation
to install this project on your local system follow these steps -
- clone this repo: use `git clone https://github.com/avinashb98/pro-chores.git`
- change directory: `cd pro-chores`
- install npm modules: `npm install`
- create `.env` from `.env_sample`
- enter environment variable values in .env

### Running the API
* use command `npm start` to start the api
* using API testing tools like postman hit the endpoint `localhost:3000/api`
* for more details go the API docs

### Testing
* use command `npm test` to run unit tests