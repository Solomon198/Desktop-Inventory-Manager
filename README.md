# Inventory Management System

## Available Scripts

In the project directory, you can run:

### `Yarn start:web:dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `Yarn start:desktop:dev:windows`

Runs the app in Electron development mode in a windows OS evironment<br>

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `Yarn start:desktop:dev:linux`

Runs the app in Electron development mode in a linux OS environment.<br>

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `Yarn compile:tsc`

Runs the typescript compiler for `.ts` files

### `yarn build:desktop:prod`

Builds the Electron app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### `yarn lint`

Runs linting for application in the `src` directory, you can also run `Yarn lint:fix` to fix any issue fixable.

### `yarn format`

Runs prettier format for codebase and you can specify `yarn format:watch` to watch for changes.

# TODO's [ phase 1 ]

- Create Realm Schemas for each modules of inventory app inside the directory `src/realm/schemas`.

- Create functionality for adding Products and Customers Using Realm

- Create functionality for Adding products Sales Using the Realm

- Create functionality for adding Stocks Using Realm

- Create functionality for adding employees

- Change customer transaction from an array of single object to return a single entity

- Redirect user to the last sale invoice page

- Handle the submit button in employee's module.
