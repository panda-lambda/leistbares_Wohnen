import json
import urllib.request
import pandas as pd
import json
from bs4 import BeautifulSoup
from datetime import date

i = 0
newd = [{}]
counter = 1
for x in range(50):
    URL = (
        f""
    )
    oururl = urllib.request.urlopen(URL).read()
    soup = BeautifulSoup(oururl, features="html.parser")
    data = json.loads(soup.find('script', type='application/json').text)
    #data= json.dumps(data)
    for x in data["props"]["pageProps"]["searchResult"]["advertSummaryList"][
            "advertSummary"]:

        for y in x["attributes"]["attribute"]:

            newkey = y["name"]
            newvalue = y["values"]
            newd[i][newkey] = newvalue  #add first key/value to list

        newd.append({})
        i += 1
    counter += 1
#print(newd)

#with open(todayjson, 'w', encoding='utf-8') as f: ##works
#     json.dump(newd, f, ensure_ascii=False, indent=4)
save_path = r'./files/'
today = date.today()
today = today.strftime("%d-%m-%Y")
df = pd.json_normalize(newd)
filename= save_path+ today +'.csv'
df.to_csv(filename, index=None)
