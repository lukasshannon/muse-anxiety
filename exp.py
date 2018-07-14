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

#Finding EEG Data
#print('Looking for an EEG stream...')
#streams = resolve_byprop('type', 'EEG', timeout=2)
#if len(streams) == 0:
#    raise RuntimeError('Can\'t find EEG stream.')

# Set active EEG stream to inlet and apply time correction
#print("Start acquiring data")
#inlet = StreamInlet(streams[0], max_chunklen=12)
#eeg_time_correction = inlet.time_correction()

# Define these parameters
duration = 120
subject = 1
session = 1

recording_path = os.path.join(os.path.expanduser("~"), "eeg-notebooks", "data", "auditory", "P300", "subject" + str(subject), "session" + str(session), ("recording_%s.csv" %
                                              strftime("%Y-%m-%d-%H.%M.%S", gmtime())) + ".csv")

stimulus = Process(target=auditory_p300.present, args=(duration,))
#recording = Process(target=inlet, args=(duration, recording_path))

stimulus.start()
#recording.start()
