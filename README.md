# Print Azure Environment Variables

A simple, zero dependency CLI script which fetches environment variables from an Azure App Service (or Function App) and prints them in a variety of formats.

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

## Supported Output Formats

You can paste this output into a `.env` file at the root of your local application.

### `--format dotenv`

```
VARIABLE_A=value
VARIABLE_B=value
```

### `--format local_settings`

This format is used by Azure Function Apps during local development (as opposed to a `.env` file). Save the output of this into the root directory of your Function App repository in a file called `local.settings.json`.

```json
{
  "Encrypted": false,
  "Values": {
    "VARIABLE_A": "value",
    "VARIABLE_B": "value"
  }
}
```

### `--format azure`

This is the standard Azure environment variable configuration format. You can paste the contents of this output into the "Advanced edit" section inside the environment variable configuration tab in your Azure Portal. This allows you to easily copy the environment variables from one application to another, whilst also removing any dependencies on a keyvault (if necessary).

```json
[
  {
    "name": "VARIABLE_A",
    "value": "value",
    "slotSetting": false
  },
  {
    "name": "VARIABLE_B",
    "value": "value",
    "slotSetting": false
  }
]
```
