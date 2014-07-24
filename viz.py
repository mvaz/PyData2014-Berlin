from bokeh.plotting import *
from bokeh.objects import HoverTool, ColumnDataSource
from bokeh.sampledata.les_mis import data


import pandas as pd
from datetime import datetime

from collections import OrderedDict

import scipy.cluster.hierarchy as sch
import seaborn as sns

import numpy as np

from IPython.html import widgets


class HDFSource(object):
	"""docstring for HD"""
	def __init__(self, filename):
		super(HDFSource, self).__init__()
		self.filename = filename

	def select(self, name, *args):
		with pd.get_store(self.filename) as store:
			return store.select(name, *args)

	def select_column(self, obj, column):
		with pd.get_store(self.filename) as store:
			return store.select_column(obj, column)

class StocksSource(HDFSource):
	"""docstring for StocksSource"""
	def __init__(self, filename, object_name):
		super(StocksSource, self).__init__(filename)
		self.filename = filename
		self.object_name = object_name

	def x(self):
		pass
		


class CorrelationMatrixSource(HDFSource):
	"""docstring for CorrelationMatrixSource"""
	def __init__(self, filename, object_name):
		super(CorrelationMatrixSource, self).__init__(filename)
		self.name = object_name

	def get_interval(self, t0, t1):
		t1 = t1 or t0
		return self.select( self.name,
			[pd.Term('major_axis', '>=', pd.Timestamp(t0)),
			 pd.Term('major_axis', '<=', pd.Timestamp(t1))] )

	def get_at(self, t):
		return self.select(self.name, self.get_equal_time_term(t))

	def iterate_time(self, start=None, end=None, square=True):
		time_axis = self.time_axis(start=start, end=end)
		time_axis = sorted( time_axis.unique() )
		for t in time_axis:
			df = self.get_at(t) #.to_frame() #.reset_index(0, drop=True)
			if square:
				df = self.make_square(df)
			yield t, df

	def entities(self):
		return self.select_column(self.name, 'minor_axis')

	def time_axis(self, start=None, end=None):
		t = self.select_column(self.name, 'major_axis')
		if start:
			t = t[ t >= start ]
		if end:
			t = t[ t <= end ]
		return t


	@classmethod
	def get_equal_time_term(self, t):
		return pd.Term( 'major_axis', '==', pd.Timestamp(t))
	@classmethod
	def make_square(self, df):
		df2 = df.iloc[:, 0, :]
		return df2[df2.index.tolist()]



class MatrixPlotter(object):
	"""docstring for MatrixPlotter"""
	def __init__(self, source):
		super(MatrixPlotter, self).__init__()
		self.number_colors = 21
		self.source = source
		self.column_source = None
		self.plot = None
		self.palette = None
		self._init_palette()

	def corrplot(self, entities):
	    figure()
	    rect('xname', 'yname', 0.9, 0.9, source=self.column_source,
	         x_range=entities, y_range=list(reversed(entities)),
	         color='colors', line_color=None,
	         tools="resize,hover", title="Correlation matrix",
	         plot_width=500, plot_height=500)
	    grid().grid_line_color = None
	    axis().axis_line_color = None
	    axis().major_tick_line_color = None
	    axis().major_label_text_font_size = "7pt"
	    axis().major_label_standoff = 0
	    
	    xaxis().location = "top"
	    xaxis().major_label_orientation = np.pi/3
	    self.plot = curplot()

	    # hover = [t for t in curplot().tools if isinstance(t, HoverTool)][0]
	    hover = [t for t in self.plot.tools if isinstance(t, HoverTool)][0]
	    hover.tooltips = OrderedDict([
	        ('names', '@yname, @xname'),
	        ('count', '@values')
	    ])
	    return self

	@staticmethod
	def reorder_dendogram(df):
		Y = sch.linkage(df.values, method='centroid')
		Z = sch.dendrogram(Y, orientation='right', no_plot=True)
		index = Z['leaves']
		return index

	def _init_palette(self):
		basis = sns.blend_palette(["seagreen", "ghostwhite", "#4168B7"], self.number_colors)
		self.palette = ["rgb(%d, %d, %d)" % (r,g,b) for r,g,b, a in np.round(basis * 255)]
	
	def _color(self, value):
		i = np.round((value + 1.) * (self.number_colors -1) * 0.5)
		return self.palette[int(i)]

	def to_data_source(self, df):
		index = self.reorder_dendogram(df)
		# col = lambda v: self.color(v)
		print self._color(0.2)
		_names = df.columns.tolist()
	    
		names = [_names[i] for i in index]
		xnames = []
		ynames = []
		values = []
		colors = []
		for n in names:
			xnames.extend([n] * len(names))
			ynames.extend(names)
			v = df.loc[n, names].tolist()
			values.extend(values)
			colors.extend([ self._color(x) for x in v])
		# alphas = np.abs(df.values).flatten()
		self.column_source = ColumnDataSource(
			data=dict(
				xname = xnames,
				yname = ynames,
				colors= colors,
				values= values,
			)
		)
		return self, names

	def as_widget(self):
		bokeh_widget= widgets.HTMLWidget()
		bokeh_widget.value = notebook_div(self.plot)
		return bokeh_widget

