#remove words less than 3 characters from ./raw.txt
#output to ./clean.json in json format
import re
import os
import sys

def purge():
  with open('raw.txt', 'r') as f:
    lines = f.readlines()
    f.close()
  with open('./src/words_list.json', 'w') as f:
    f.write("{\n\"classic\":[\n")
    for line in lines:
      words = re.findall(r'\b\w+\b', line)
      for word in words:
        if len(word) > 3 and len(word) < 9:
          if line != lines[-1]:
            f.write("\"" + word + "\",\n")
          else:
            f.write("\"" + word + "\"\n")
      
    f.write("]}\n")
    f.close()

purge()




