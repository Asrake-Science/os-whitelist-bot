# I want to update my webserver, but dont have time

If you have used [git](https://git-scm.com) to pull the repo from github, all you have to do is:

- Close all Terminals that conflict with the webserver
    - Backup whitelist.json incase you screw something up

    - After doing so, run

        ```js
        git pull
        ```

All this does is fetch new files from the github repo, but will not interfere with whitelist.json

## I want to hard-reset my webserver

If you're done with your previous project and want to wipe all keys + update the webserver, you can run

```js 
git reset --hard HEAD
```