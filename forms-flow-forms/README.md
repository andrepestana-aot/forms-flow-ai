# Form Management Platform

![Formio](https://img.shields.io/badge/formio-3.2.0-blue)  ![Formsflow-forms](https://img.shields.io/docker/v/formsflow/forms-flow-forms?label=formsflow-forms-latest-image)

**formsflow.ai** leverages form.io to build "serverless" data management applications using a simple drag-and-drop form builder interface.

To know more about form.io, go to  <https://form.io>.

## Table of Content

1. [Prerequisites](#prerequisites)
2. [Solution Setup](#solution-setup)
   * [Step 1 : Keycloak Setup](#keycloak-setup)
   * [Step 2 : Installation](#installation)
   * [Step 3 : Running the Application](#running-the-application)
   * [Step 4 : Health Check](#health-check)
3. [Custom Components](#custom-components)
4. [Adding new indexes](#adding-new-indexes)
5. [LICENSE](#license)

## Prerequisites

* For docker based installation [Docker](https://docker.com) need to be installed.

## Solution Setup

### Keycloak Setup

Not applicable.  
**Please note that the forms-flow-forms server is accessed using root user account.**

### Installation

* Make sure you have a Docker machine up and running.
* Make sure your current working directory is "forms-flow-ai/forms-flow-forms".
* Rename the file [sample.env](./sample.env) to **.env**.
* Modify the environment variables in the newly created **.env** file if needed. Environment variables are given in the table below,
* **NOTE : `{your-ip-address}` given inside the .env file should be changed to your host system IP address. Please take special care to identify the correct IP address if your system has multiple network cards**

**Additionally, you may want to change these**

* The value of Mongo database details (especially if this instance is not just for testing purposes)
* The value of ROOT user account details (especially if this instance is not just for testing purposes)
  
### Running the application

* forms-flow-forms service uses port 3001, make sure the port is available.
* `cd {Your Directory}/forms-flow-ai/forms-flow-forms`

* Run `docker-compose up -d` to start.

*NOTE: Use --build command with the start command to reflect any future **.env** changes eg : `docker-compose up --build -d`*

#### To stop the application

* Run `docker-compose stop` to stop.

### Health Check

   The application should be up and available for use at port defaulted to 3001 in  (i.e. <http://localhost:3001/>)

        Default Login Credentials
        -----------------
        User Name / Email : admin@example.com
        Password  : changeme


## Custom Components

**formsflow.ai** has custom components supported which are created by extending the
base components within forms-flow-forms and then registering them within the core renderer.

Custom componets available in **formsflow.ai** are:

|Component Name | About | How to use |
|--- | --- | --- |
|**Text Area with Analytics** | To enable Text fields for sentiment analysis processing | [link](./custom-components/text-area-with-analytics/README.md)|

If you are interested in adding custom components for your use case in **formsflow.ai** we highly
recommend you to take a look at [Custom Component Docs](https://formio.github.io/formio.js/app/examples/customcomponent.html)
to understand how  Form.io renderer allows for the creation of Custom components.
You can also take a look at [formio.contrib](https://github.com/formio/contrib)
to look for examples and even contribute the custom components you create.

## Adding new indexes

You can add new indexes in Mongodb shell, according to your requirement. You can create indexes like below example:

```
db.submissions.createIndex({
    "data.applicationStatus ": 1
})
```

In this example:

* `submissions` is the collection name.
* `data.applicationStatus` is the fields which are to be added in index.

## LICENSE

We have build formsflow.ai form management platform leveraging [formio](https://github.com/formio/formio).
We use the OSL-v3 license similar to formio to ensure appropriate attribution is
provided to form.io. Please read the [license](./LICENSE.txt) for more information.

### Additional reference

Check out the [installation documentation](https://aot-technologies.github.io/forms-flow-installation-doc/) for installation instructions and [features documentation](https://aot-technologies.github.io/forms-flow-ai-doc) to explore features and capabilities in detail.