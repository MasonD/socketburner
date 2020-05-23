# socketburner

A WebSocket script mirroring service for the game [Bitburner](https://github.com/danielyxie/bitburner).

---

### Dependencies
* [`git`](https://git-scm.com/)
* [`nodejs`](https://nodejs.org/)
* [`yarn`](https://yarnpkg.com/)

---

### Installation
#### Linux
In your terminal: 
```
git clone https://github.com/MasonD/socketburner.git
cd socketburner/
yarn
```

Then save all the scripts in `home/` into their in-game equivalents using the in-game `nano`. E.g., for `socketburner.js`:
```
nano socketburner.js
```

---

### Usage
In-game:
```
run socketburner.js
```

#### Starting `socketburner`
#### Linux
In your terminal: 
```
cd socketburner/
yarn start
```

Any changes made to files in `home/` will now be mirrored to files in the game.

To recursively copy scripts from a directory `<scripts_directory>/` into the game:
```
cp -r <scripts_directory>/* home/
```

Note that the above command will cause `socketburner` to fail if the directory used contains files that don't have the extensions ".txt", ".js", ".ns" or ".script". 

#### Stopping `socketburner`
In-game:
```
Ctrl+/
```

then, in the terminal from where you ran `yarn start`:
```
Ctrl+c
```

---

### Notes
* Deleting, moving or renaming files in `home/` whilst `socketburner` is running will cause it to break.