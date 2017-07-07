# check-for-leaks 

a tool to help avoid publishing secrets to github and npm

## Why?

It's too easy to publish secrets to GitHub and npm by accident.
It's even easier to make this mistake when your project
has both a `.gitignore` file and a `.npmignore` file.

From the npm docs on [keeping files out of your package](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package):

> Use a `.npmignore` file to keep stuff out of your package.  If there's
no `.npmignore` file, but there *is* a `.gitignore` file, then npm will
ignore the stuff matched by the `.gitignore` file.  If you *want* to
include something that is excluded by your `.gitignore` file, you can
create an empty `.npmignore` file to override it.

Note that 👉 **if a `.npmignore` file exists, npm disregards the `.gitignore` file** 👈. This is a subtle behavior that can have dangerous
consequences: Imagine that your project has a healthy `.gitignore` with
all of the secrets ignored, then you later add a `.npmignore` file to reduce the size of the published module. Any patterns that you don't
copy over from the `.gitignore` file will now be included when you publish the module.

## Installation

```sh
npm install check-for-leaks --save
```

## Usage

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
