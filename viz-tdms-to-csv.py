# Required libraries.
from nptdms import TdmsFile
import numpy as np
import pandas as pd
import csv
import os
import sys

def tdms_to_csv(filepath):
    tdms_file = TdmsFile.read(filepath) # Read in tdms file.

    df = tdms_file.as_dataframe() # Convert tdms file to Pandas dataframe.

    for col in df:
        temp_col = col
        col = col.split('\'')[3]
        col = col.replace(" ", "_")
        df = df.rename(columns={temp_col: col}) 

    index_array = []
    for dp in range(0, len(df['Current'])):
        index_array.append(dp)
    df['index'] = index_array

    csv_filepath = filepath.rsplit(".", 1)[0] + ".csv" # Removed the old filetype from the fp, add the new one.

    df.to_csv(csv_filepath) # Convert df to csv file, save to passed string.

    print(csv_filepath)
    return csv_filepath

# convert the files in directory and subdirectories tdms
def tdms_to_csv_dir(dir_path, replace=False):
    for subdir, dirs, files in os.walk(dir_path):
        for file in files:
            if (file.endswith('.tdms') and ((file.replace(".tdms", ".csv") not in files) or replace == True)):
                tdms_to_csv(os.path.join(subdir, file))


if __name__ == "__main__":
    if len(sys.argv) == 2: # if we only have one argument passed
        print("Starting file coversion: tdms --> csv @ directory ", sys.argv[1])
        tdms_to_csv(sys.argv[1])
        print("Conversion completed :)")
    elif len(sys.argv) == 3: # take in an a boolean argument
        if sys.argv[2] == "True" or sys.argv[2] == "true":
            print("Starting file coversion: tdms --> csv @ directory ", sys.argv[1], "with replacement")
            tdms_to_csv_dir(sys.argv[1], True)
            print("Conversion completed :)")
        else:
            print("Starting file coversion: tdms --> csv @ directory ", sys.argv[1], "without replacement")
            tdms_to_csv_dir(sys.argv[1], False)
            print("Conversion completed :)")