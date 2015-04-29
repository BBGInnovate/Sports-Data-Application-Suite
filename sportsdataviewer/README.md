#SportsDataViewer Application
This is a simple Geddy.js application that displays the JSON created by the SportsDataProvider application.

I should be run with forever.

To start it:
$ sudo forever start application.js

To stop it:
$ sudo forever stop application.js

There is a bug in a dependence of the session lib used by Geddy so the application.js deletes the _session_store.json file on start up then every hour.
