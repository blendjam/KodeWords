#remove words less than 3 characters from ./raw.txt
#output to ./clean.json in json format
import re
import os
import sys

input_file = 'original.txt'
output_file = 'vanilla.txt'

def purge():
  with open(input_file, 'r') as f:
    lines = f.readlines()
    f.close()
  with open('./src/'+output_file, 'w') as f:
    f.write("{\n\"classic\":[\n")
    for line in lines:
      words = re.findall(r'\b\w+\b', line)
      for word in words:
        if line != lines[-1]:
            f.write("\"" + word + "\",\n")
        else:
          f.write("\"" + word + "\"\n")
      
    f.write("]}\n")
    f.close()

purge()




