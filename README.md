# Zero Namespace dApp

**Currently, this repo contains code for a whole suite of dApps. We are working on migrating each one to its own repo, and using [zOS](https://github.com/zer0-os/zOS) as a container app.**

## Developing Locally

Copy the contents of `.env.sample` to a `.env` file in the root project folder, and provide values for all variables.

Run [Node Version Manager](https://github.com/nvm-sh/nvm) to use the supported version of Node, ensuring it is installed on your system:

```
nvm use
```

Then, run the following to install the packages:

```
npm install
```

Finally, start the development server:

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

## Contributing

There is always work to be done, so if you've noticed a bug or want to get involved at a deeper level, feel free to open a PR, or get in touch with the dApp team. Be sure to check out the [contributing guidelines](CONTRIBUTING.md) before opening a PR.
