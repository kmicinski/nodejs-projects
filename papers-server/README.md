# Papers server

This is a small server which serves static files in a papers
directory.  The idea is that GET requests turn in to instructions
given to Skim top open up a paper.

Usage:

    node papers-server.js /path/to/my/papers port

After this, sending a GET request to

    localhost:port/paper/in/directory.pdf#note=3

Will instruct Skim to open the 3rd anchored note in the document
stored at the specified path (from the base directory).

