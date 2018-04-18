import pandas as pd
from bs4 import BeautifulSoup

input_html = "incidents.htm"
with open(input_html, "r") as ifile:
  soup = BeautifulSoup(ifile, 'html5lib')

data = soup.find_all(["h3","li"])
selected_data = ""
for line in data:
   selected_data = selected_data + line.text + '\n'   
if bool(BeautifulSoup(selected_data,"html.parser").find()) == False:
   print("No Tag Found")
with open('incidents_raw.txt','w') as file:
   file.write(selected_data)
import re
from calendar import month_name

# TODO: read and clean raw text file and store in clean_incidents
text_file = open('incidents_raw.txt', 'r')
#delete [edit]
incidents_raw = text_file.readlines()
clean_incidents = ""
curr_year = 0
pattern = "|".join(month_name[1:])

for line in incidents_raw:
   if line.find('[edit]') == -1 :
       if line.find('Flight') != -1 and line.find('–') != -1 and re.search(pattern, line, re.IGNORECASE).group(0) != None and curr_year >= 1997 :
           clean_incidents += str(curr_year) + ' ' + line
       else:
           continue;
   else:
       curr_year = int(line[0:4])
incidents_df = []
for line in clean_incidents.splitlines():
   index1 = line.find('–')
   date = line[0:index1-1]
   index2 = line.find('Flight')
   ind = index2
   start = 0
   while(1):
       ind = ind - 1
       if line[ind] == ' ' and line[ind+1].isupper():
           start = ind
       if line[ind] == ' ' and line[ind+1].islower() and line[ind+1] != 'd':
           break
       if line[ind] == '–':
           start = ind+1
           break
      
   airline = line[start:line.find('Flight')].strip()
   #airline = line[index1+2:index2].strip()
   index = index2 + 7
   while(line[index].isdigit()):
       index = index + 1
   flight_num = line[index2+7:index]
   temp_dict = {'Date': date, 'Airline': airline, 'FlightNum': flight_num}

   incidents_df.append({'Date': date, 'Airline': airline, 'FlightNum': flight_num})

incidents_df = pd.DataFrame(incidents_df).drop_duplicates()
incidents_df['Date'] = pd.to_datetime(incidents_df['Date'])
incidents_df.to_csv('incidents', sep = ',')

