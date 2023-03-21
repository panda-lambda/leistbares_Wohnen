import pandas as pd
from shapely.geometry import Point, Polygon
import json
import os


cwd = os.getcwd()#get working directory
file_list=os.listdir(cwd+"/files")
together_df= pd.read_csv("alltogether2.csv") #load the cumulated ads
for file in file_list:
    if(not os.path.isfile(cwd+"/output/"+file)):
        df = pd.read_csv(cwd+"/files/"+file) #load csv
        
        for column in together_df:
            
            together_df[column]=together_df[column].astype(str).str.replace("\'\]", "")
            together_df[column]=together_df[column].astype(str).str.replace("\[\'", "")
        newdf= df[["ADID","POSTCODE","ESTATE_SIZE/LIVING_AREA","NUMBER_OF_ROOMS","PRICE","COORDINATES"]].copy() #copy data 
      
        newdf = newdf.dropna() #drop NAN values
        newdf["ZBEZ"]="" #create new column
        with open('bez.json', encoding='utf-8') as fh:#load json with zählbezirk data
            data = json.load(fh)
        for idxOfPoly in range(len(data["features"])):  #iterate through every polygon and there every point 
            polygonlist=[]    
            for point in data['features'][idxOfPoly]['geometry']['coordinates'][0]: #load csv with ads
                polygonlist.append(Point(point[1],point[0])) #create polygons1    
            polygons= Polygon(polygonlist)#create polygons2  
            for idx, points in enumerate(newdf["COORDINATES"]): #idx is the index and points gets the coordinates (['22323,2323'])
                if (not isinstance(points,str)):#check if coordinates are empty, if so, continue
                    continue
                x = points.strip("[]'").split(",")#strip and split to get lat and long as single floats
                p1 = Point(x[0],x[1])#create point
                if (polygons.contains(p1)): #check if current polygon contains current point
                    if (newdf["ZBEZ"].loc[idx]!=""):
                        print("doppelt")# check for double entries
                    newdf["ZBEZ"].loc[idx]=data['features'][idxOfPoly]["properties"]["ZBEZ"] #set zbez of current point to the corresponding polygon zbez     
        for idx, points in enumerate(newdf["ZBEZ"]):
            if (points==""): #check if coordinates are empty, if so, delete the entire row
                newdf.drop([idx],inplace=True)
                
        m = ~df['BODY_DYN'].str.contains('gemeindewohnung*|Direktvergabe*|gemeindebau*|Vormerk*',na=False,case=False)
        df= df[m] #removes some keywords
        k= ~df['HEADING'].str.contains('gemeindewohnung*|Direktvergabe*|gemeindebau*|Vormerk*',na=False)
        df= df[k]        
        together_df=pd.concat([together_df,newdf],ignore_index=True)
        
        newdf.to_csv(cwd+"/output/"+file,index=False)#export new dataframe as csv
together_df=together_df.drop_duplicates(subset=['ADID'], keep='last')     # remove duplicates and keep the last one 
together_df.to_csv("alltogether.csv",index=False)#export cumulative dataframe as csv
