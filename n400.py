# IMPORT STATEMENTS

from __future__ import division  # so that 1/3=0.333 instead of 1/3=0
from multiprocessing import Process, Queue
from psychopy import locale_setup, visual, core, event, logging, sound, gui, monitors  # things like STARTED, FINISHED
import numpy as np  # whole numpy lib is available, prepend 'np.'
from numpy import sin, cos, tan, log, log10, pi, average, sqrt, std, deg2rad, rad2deg, linspace, asarray
from numpy.random import random, randint, normal, shuffle
import os  # handy system and path functions
import csv
import sys # to get file system encoding
import random
from pandas import DataFrame
from pylsl import StreamInlet, resolve_stream, resolve_byprop

#######  LSL Streaming
print('Looking for an EEG stream...')
streams = resolve_byprop('type', 'EEG', timeout=2)
if len(streams) == 0:
    raise RuntimeError('Can\'t find EEG stream.')

# Set active EEG stream to inlet and apply time correction
print("Start acquiring data")
inlet = StreamInlet(streams[0], max_chunklen=12)
eeg_time_correction = inlet.time_correction()
# Get the stream info and description
info = inlet.info()
description = info.desc()

# Get the sampling frequency
# This is an important value that represents how many EEG data points are
# collected in a second. This influences our frequency band calculation.
fs = int(info.nominal_srate())
#####Getting the CSV File ready

#Make sure you are in the correct directory



#####


##### Create a CSV with the person's name. This is the person's ID
#usern = input("Enter your username:")
#lSize = int(input("Enter your sample Size"))
usern = "Sydney"
#lSize =int(lSize)
#####

markernames = [1, 2]
n_trials = 20
iti = 0.3
soa = 0.2
jitter = 0.2
record_duration = np.float32(120)
buffer_length = 15

# Length of the epochs used to compute the FFT (in seconds)
epoch_length = 1

# Amount of overlap between two consecutive epochs (in seconds)
overlap_length = 0.8

# Amount to 'shift' the start of each next consecutive epoch
shift_length = epoch_length - overlap_length


# Setup graphics

def lsl(q):
    with open(usern+'.csv','w') as f:
        writer = csv.writer(f)
        power=1
        stim= "+"
        #if not q.empty():
        #   power,stim =q.get()

        while power==1:
            if q.empty():
                eeg_data, timestamp = inlet.pull_chunk(
                        timeout=1, max_samples=int(shift_length * fs))
                #sample,timestamp = inlet.pull_sample()
                print (eeg_data)
                print (timestamp)
                data=[timestamp,eeg_data]
                #data.extend(sample)
                writer.writerow(data)
            else:
                power,stim =q.get()


###Code Below is all the  Main Loop #####

if __name__ == "__main__":
    q= Queue()
#    q.put([1,"+"])
    l= Process(target=lsl,args=(q,))
    l.start()
    ####Variables For the Loop#####
    clock=core.Clock()
    stim= True
    ###/End of Variables For the Loop#####
    aud1 = sound.Sound('C', octave=5, sampleRate=44100, secs=0.2)
    aud1.setVolume(0.8)
    aud2 = sound.Sound('D', octave=6, sampleRate=44100, secs=0.2)
    aud2.setVolume(0.8)
    auds = [aud1, aud2]

    # Setup trial list
    sound_ind = np.random.binomial(1, 0.25, n_trials)
    trials = DataFrame(dict(sound_ind=sound_ind, timestamp=np.zeros(n_trials)))

    # Setup graphics
    mon = monitors.Monitor('test')#fetch the most recent calib for this monitor
    mon.setDistance(114)#further away than normal?
    mywin = visual.Window(size=[1024,768], monitor=mon)

    fixation = visual.GratingStim(win=mywin, size=0.2, pos=[0, 0], sf=0,
                                  rgb=[1, 0, 0])
    fixation.setAutoDraw(True)
    mywin.flip()

    for ii, trial in trials.iterrows():
        # Intertrial interval
        core.wait(iti + np.random.rand() * jitter)
        q.put([1,"+"])
        # Select and play sound
        ind = trials['sound_ind'].iloc[ii]
        auds[ind].play()
        q.put([1,ind])
        # Send marker
        #timestamp = time()
        #outlet.push_sample([markernames[ind]], timestamp)

        # offset
        core.wait(soa)
        #if len(event.getKeys()) > 0 or (time() - start) > record_duration:
        #    break
        event.clearEvents()

    # Cleanup
    q.put([0,""])
    l.terminate()
    mywin.close()



#    for k in range(len(acrL)):
#        #i=k
#        for frameN in range(180):
#            win.flip()
#            if frameN ==0:
#                q.put([1,"+"])
#            if 0 <= frameN < 60:
##                print("0-60: Time - %f",(clock.getTime()))
#                fixation.draw()

#            if frameN == 60:
#                q.put([1,acrL[k]])
##            if 60 <= frameN < 180:
#                word.draw()
##                print("60-180: Time - %f",(clock.getTime()))
