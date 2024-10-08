# Print Azure Environment Variables

A simple CLI script which fetches environment variables from an Azure App Service (or Function App) and prints them in a variety of formats.

This is useful for local application development (syncing remote environment variables) and also for disaster recovery planning in situations where you need to spin up a new application with identical variables as fast as possible. Keyvault secrets are automatically fetched so that you have a "clear text" representation of what the environment looks like.

## Installation

1. Ensure that you have [installed the Microsoft Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
2. Check that you are signed in and have chosen the correct subscription: `az login`.
3. Make sure you are running NodeJS 20+: `node -v`.
4. Install this script globally using the NPM package manager:

```shell
$ npm install -g @adammcarth/print-azure-env
```

## Usage

```shell
$ print-azure-env --type webapp --resource-group staging --name my-webapp
```

| Flag                 | Description                                                                              | Required? | Default    |
|----------------------|------------------------------------------------------------------------------------------|-----------|------------|
| -h, --help           | Display further CLI documentation in the console.                                        | No        |            |
| -t, --type           | The type of Azure resource. Use either `webapp` or `functionapp`.                        | Yes       |            |
| -r, --resource-group | The plain text name of the resource group your application sits under.                   | Yes       |            |
| -n, --name           | The plain text resource name for your application.                                       | Yes       |            |
| -s, --slot           | Optional.                                                                                | No        | Production |
| -f, --format         | What format to print the data in. Allowed values: `dotenv`, `local_settings` or `azure`. | No        | `dotenv`   |
| --no-keyvault        | Prevent this script from fetching secrets from the keyvault.                             | No        | `false`    |
