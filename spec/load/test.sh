#!/bin/bash

HOST="http://54.72.161.42"

N=$1
C=$2
PATH=$3

URL=$HOST/$PATH
FILENAME="kn${N}c$C"
DATA_PATH="data/$FILENAME.txt"
OUTPUT_PATH="output/$FILENAME.txt"

# Execute Apache Bench test
/usr/sbin/ab -k -n $N -c $C -g $DATA_PATH $URL > $OUTPUT_PATH

echo "Output stored in '$OUTPUT_PATH'"

# Plot the resulting data
./plot.sh $FILENAME $N $C

