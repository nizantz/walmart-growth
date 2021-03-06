# walmart-growth
D3 Walmart Store Growth

![walmart-growth](https://cloud.githubusercontent.com/assets/90957/24433470/caaf9818-13dd-11e7-9c7d-204d0d814da5.png)

![screen shot 2017-07-31 at 2 29 02 pm](https://user-images.githubusercontent.com/90957/28801521-cd0e23aa-7606-11e7-8eac-a6efbb3f840f.png)

Inspired by http://flowingdata.com/2010/04/07/watching-the-growth-of-walmart-now-with-100-more-sams-club/
created by Nathan Yau "http://flowingdata.com/about-nathan", I have created a D3 version of the same.
For moving through the years , I have used chroniton, a time slider (https://github.com/xaranke/chroniton)

To run first clone the source:
```haskell
git clone https://github.com/nizantz/walmart-growth.git
```

Go to the root folder:
```haskell
cd ~/walmart-growth
```
Start server (on mac) :
```haskell
/usr/bin/python -m SimpleHTTPServer 5555
```

Access the URL -> http://localhost:5555

# Update:
Created another map using the same data. This time data is visualized using mapbox gl and mapbox vector tiles (and d3).
Access the URL -> http://localhost:5555/map.html
