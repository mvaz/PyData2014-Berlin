from bokeh.plotting import *
from bokeh.objects import HoverTool, ColumnDataSource
from bokeh.sampledata.les_mis import data

import pandas as pd
from datetime import datetime


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
	def __init__(self, arg):
		super(MatrixPlotter, self).__init__()
		self.arg = arg
	
	def show(self):
		pass
