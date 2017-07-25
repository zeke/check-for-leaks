# check-for-leaks 

> avoid publishing secrets to git and npm

## Why?

It's too easy to accidentally publish files like `.npmrc` or `.env` to a remote 
git repo or the npm registry. It's even easier to make this mistake when your 
project has both a `.gitignore` file and a `.npmignore` file.

If a `.npmignore` file exists, [npm will disregard the `.gitignore` file](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package). This 
makes sense, but it is a subtle behavior that can have dangerous consequences: 
Imagine that your project has a healthy `.gitignore` with all of the secrets 
ignored, then you later add a `.npmignore` file to reduce the  size of the 
published module. Any patterns that you don't copy over from the `.gitignore` 
file will now be included when you publish the module.

## Usage (TLDR version)

To check your project for leaks before every `git push` or `npm publish`, run the following:

```sh
cd my-vulnerable-project
npm i -g npe
npm i -D check-for-leaks husky
npe scripts.prepack check-for-leaks
npe scripts.prepush check-for-leaks
```

[npe](http://ghub.io/npe) is a CLI for editing package.json files. 
[husky](http://ghub.io/husky) creates git hooks.

## Usage (cool-story-bro version)

This package can be used from the command line or as a module.

Here's how the command line interface works:

```
check-for-leaks some/dir
```

You can also run it with no arguments and the current working directory 
will be checked by default:

```
cd some/dir && check-for-leaks
```

The module looks in the given directory recursively for files with these names:

- `.env` - a [conventional](https://encrypted.google.com/search?hl=en&q=.env%20file) file for storing environment variables
- `.npmrc` - [npm configuration file](https://docs.npmjs.com/files/npmrc) that may include a secret token

If no dangerous files are found, the CLI exits quietly:

```
check-for-leaks some/safe/project
```

If dangerous files are present in the tree but *not ignored* by the local
`.gitignore` file, warnings are emitted and the CLI exits ungracefully:

```
check-for-leaks some/unsafe/project

warning: .env is not in your .gitignore file
warning: .npmrc is not in your .gitignore file
```

If the directory also has a `.npmignore` file, it will be
checked too.

```
check-for-leaks some/project/with/npmignore/and/gitignore

'warning: .env is not in your .npmignore file'
```

## License

MIT
