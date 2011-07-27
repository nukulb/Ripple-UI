# Setting up your environment to work on Ripple

## Setting up node

Some good resources for getting node and npm running on your system:

  - [Installing Node and NPM](http://joyeur.com/2010/12/10/installing-node-and-npm/)
  - [What we use personally](https://gist.github.com/579814#file_only_git_all_the_way.sh)

Most of the development on Ripple is done with Linux and OSX, you may
be able to get this working on windows but is not supported.

## Configuring the environment

Once you get node and npm installed you should be well on your way to getting
things setup.

We have created a [configure](https://github.com/blackberry/Ripple-UI/blob/master/configure) script you can run 
to do all of the heavy lifting for you. You should be able to just run:

    ./configure

In the root directory of ripple and it will grab all the packages we need to build 
and run ripple. The best way to test that this works is to run:

    jake deploy

As that does that full build of ripple, running all the tests, linting the code and 
compressing it.

