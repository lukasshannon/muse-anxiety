from time import time
from optparse import OptionParser
from multiprocessing import Process
from mne import Epochs, find_events
from time import time, strftime, gmtime
import os
from stimulus_presentation import auditory_p300
from utils import utils
from collections import OrderedDict
import numpy as np
from pandas import DataFrame
from psychopy import visual, core, event, sound,monitors
from pylsl import StreamInfo, StreamOutlet, resolve_byprop, StreamInlet





raw = utils.load_data('auditory/P300', sfreq=256.,
                      subject_nb=subject, session_nb=session)

raw.plot_psd();

raw.filter(1,30, method='iir')

events = find_events(raw)
event_id = {'Non-Target': 1, 'Target': 2}

epochs = Epochs(raw, events=events, event_id=event_id,
                tmin=-0.1, tmax=0.8, baseline=None,
                reject={'eeg': 100e-6}, preload=True,
                verbose=False, picks=[0,1,2,3])
print('sample drop %: ', (1 - float(len(epochs.events))/float(len(events))) * 100)
epochs

conditions = OrderedDict()
conditions['Non-target'] = [1]
conditions['Target'] = [2]

fig, ax = utils.plot_conditions(epochs, conditions=conditions,
                                ci=97.5, n_boot=1000, title='',
                                diff_waveform=(1, 2))
