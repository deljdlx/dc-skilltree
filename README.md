# (Skill) tree editor


This project is a modular tool designed to create and structure data structures
For now, it is focused on creating skill trees, but it can be easily adapted to other types of data structures.

For now, no backend is implemented, so the data is stored in the browser's local storage.


## Running the project

### Using docker compose
```bash
docker compose build
docker compose -f compose-local.yml up
```

### Using PHP built-in server
```bash
cd src
php -S 0.0.0.0:8080 -t .
```

### Using nodejs
Image upload will not work with this method.
```bash
cd src
node server.js
```

### Using "nothing" 😂
You must have a http server installed on your machine.
Go to http://YOUR_HOST/PATH_TO_SKILL_TREE/src/index.html

## Next steps
- [ ] Technical documentation
- [ ] "Form builder" module
- [ ] Building a lighter docker image
- [ ] Maybe someday convert this to react and/or vuejs
