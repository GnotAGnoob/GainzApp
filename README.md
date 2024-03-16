# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

Install dependencies with `pnpm add` and start a development server:

```bash
pnpm dev
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `npm run preview`.

## Database

### Local Database

to run a local postgres database, install docker-desktop and run it. then run the following command:

```bash
pnpm docker
```

### Generate migration files

```bash
pnpm db:generate
```

### Migration

for making changes to the database

```bash
pnpm db:migrate
```

### Introspect

something about what happened

```bash
pnpm db:introspect
```

### Studio

database browser viewer and editor

```bash
pnpm db:studio
```

## Run Test

```bash
pnpm test
```

## Component library

https://www.bits-ui.com/docs/introduction
