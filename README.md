# Commands JS

A collection of useful commands, developed with NodeJS.

## List of Commands

- [**`npv:`**](#npv) Checks for dependencies updates in a **Node JS** project.
- [**`fsls:`**](#fsls) Lists the details of the **files** and **directories** found in the given **path**.
- [**`fsempty:`**](#fsempty) Display a list of all empty directories found within the given path.

## NPV

This command reads the dependencies from a **`package.json`** file and displays the latest **`patch`**, **`minor`**, and **`major`** versions available.

| **Arguments / Options**    | **Description**                                         |
|----------------------------|---------------------------------------------------------|
| **`[path]`**               | Path to the `package.json` file.                        |
| **`-u` `--updates`**       | Displays only the dependencies that are not up to date. |
| **`--no-patch`**           | Ignore `patch` versions when checking for updates.      |
| **`--no-minor`**           | Ignore `minor` versions when checking for updates.      |
| **`--no-major`**           | Ignore `major` versions when checking for updates.      |

## FSLS

This command displays a table with detailed information about each `file` and `directory` found within the given `path`.<br/>
The information will be displayed in the following columns:

* The last **modification** date.
* The **creation** date.
* The **file** size or the number of **items** found inside the directory.
* The **name** of the item.

| **Arguments / Options**    | **Description**         | **Default**                |
|----------------------------|-------------------------|----------------------------|
| **`[path]`**               | Path to the directory.  | Current working directory. |
| **`--no-files`**           | Ignore the files.       | `false`                    |
| **`--no-dirs`**            | Ignore the directories. | `false`                    |

## FSEMPTY

This command display a list of all empty directories found within the given path.

| **Arguments / Options** | **Description**         | **Default**                |
|-------------------------|-------------------------|----------------------------|
| **`[path]`**            | Initial directory path. | Current working directory. |
