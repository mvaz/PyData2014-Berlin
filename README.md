PyData2014-Berlin
=================

Networks meet Finance in Python - July 27 2014

This the repository of the talk of the same name.

http://pydata.org/berlin2014/abstracts/#247


The talk was supported by some IPython notebooks which you are welcome to try out.
To get a feeling of what is in there, you can take a look at the static version.
For running the widgets and playing with the data, you'll need an IPython server running, though.

[Bank Exposures](http://nbviewer.ipython.org/github/mvaz/PyData2014-Berlin/blob/master/Bank%20Exposures.ipynb)

[#1 DAX30 - getting and cleansing data](http://nbviewer.ipython.org/github/mvaz/PyData2014-Berlin/blob/master/1%20-%20DAX30.ipynb)

[#2 DAX30 - historical analysis of correlation matrices](http://nbviewer.ipython.org/github/mvaz/PyData2014-Berlin/blob/master/2%20-%20DAX30%20Correlations.ipynb)

[#3 DAX30 - constructing a network from correlation matrices](http://nbviewer.ipython.org/github/mvaz/PyData2014-Berlin/blob/master/3%20-%20DAX30%20Network.ipynb)

[#4 DAX30 - construct asset baskets from network centrality](http://nbviewer.ipython.org/github/mvaz/PyData2014-Berlin/blob/master/4%20-%20DAX30%20Baskets.ipynb)

# Dependencies

I am using anaconda as a distribution and following packages

- ipython 2.1
- pandas 0.14.1
- numpy
- pytables 3.1.

- scikit-learn
- matplotlib
- seaborn
- bokeh 0.5.1

- networkx
- planarity (installed through pip, if you have problems installing it on Mac OS take a look at my fork)

- graphviz
- pygraphviz



# References

The main inspiration for this talk is from blog posts

  http://www.fna.fi/blog/2012/11/23/tutorial-7-correlation-networks/  
  http://www.fna.fi/demos/files/lehmansammon.html

and following papers:

  1. for the main results

    Spread of risk across financial markets: better to invest in the peripheries  
    F. Pozzi, T. Di Matteo and  T. Aste  
    2013, Nature Scientific Reports 3, Article number: 1665 doi:10.1038/srep01665  
    http://www.nature.com/srep/2013/130416/srep01665/full/srep01665.html

  2. for looking into historical market correlations

    Quantifying the Behavior of Stock Correlations Under Market Stress  
     Tobias Preis, Dror Y. Kenett, H. Eugene Stanley,	Dirk Helbing & Eshel Ben-Jacob  
     2012 Scientific Reports 2, Article number: 752 doi:10.1038/srep00752  
     http://www.nature.com/srep/2012/121018/srep00752/full/srep00752.html

    Temporal Evolution of Financial Market Correlations  
    Daniel J. Fenn, Mason A. Porter, Stacy Williams, Mark McDonald, Neil F. Johnson, Nick S. Jones  
    http://arxiv-web3.library.cornell.edu/abs/1011.3225?context=physics

  3. for considering exposure networks

    Early-warning signals of topological collapse in interbank networks  
    Tiziano Squartini, Iman van Lelyveld & Diego Garlaschelli  
    2013 Scientific Reports 3, Article number:  3357    doi:10.1038/srep03357  
    http://www.nature.com/srep/2013/131128/srep03357/full/srep03357.html


You might wish to have a look at Yves Hilpisch's talk and [slides](http://hilpisch.com/Large_Financial_Data.html#/), as goes through some of the financial concepts I mention.


