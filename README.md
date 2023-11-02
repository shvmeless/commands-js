# Commands JS

A collection of useful commands, developed with NodeJS.

## List of Commands

- [**`npv:`**](#npv) Checks for dependencies updates in a **Node JS** project.

## NPV

This command reads the dependencies from a **`package.json`** file and displays the latest **`patch`**, **`minor`**, and **`major`** versions available.

| **Arguments / Options**    | **Description**                                         |
|----------------------------|---------------------------------------------------------|
| **`[path]`**               | Path to the `package.json` file.                        |
| **`-u` `--updates`**       | Displays only the dependencies that are not up to date. |
| **`--no-patch`**           | Ignore `patch` versions when checking for updates.      |
| **`--no-minor`**           | Ignore `minor` versions when checking for updates.      |
| **`--no-major`**           | Ignore `major` versions when checking for updates.      |
