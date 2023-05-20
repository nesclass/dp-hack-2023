import re, json
from datetime import datetime

months = {
    'янв': 1,
    'фев': 2,
    'мар': 3,
    'апр': 4,
    'май': 5,
    'июн': 6,
    'июл': 7,
    'авг': 8,
    'сен': 9,
    'окт': 10,
    'ноя': 11,
    'дек': 12
}
file = open("participant.json")
all_data = json.load(file)
print(all_data)
full_data = {"fullname": "Куклин Антон Эдуардович","dob":"2011-11-23","rosatomStarted":"02-2019","educ":[{"ended": "2011"}]}

def convert_date_string(date_string):
   
    match = re.match(r'^(\d{4})-(\d{2})-(\d{2})$', date_string)
    if match:
        year, month, day = match.groups()
        return f"{day}:{month}:{year}"
    
    match = re.match(r'^(\d{2})\.(\d{2})\.(\d{4})$', date_string)
    if match:
        day, month, year = match.groups()
        return f"{day}:{month}:{year}"
    match = re.match(r'^(\d{2})-(\d{2})-(\d{4})$',date_string)
    if match:
        day, month, year = match.groups()
        if int(month) >= 12:
            return f"{day}:{month}:{year}"
        else:
            raise ValueError(f"Invalid date string: {date_string}")
    match = re.match(r'^([а-я]{3})(\d{2})$', date_string.lower())
    if match:
        month_name, year = match.groups()
        month = months[month_name]
        if len(year) == 2:
            year = f"20{year}"
        return f"{month}:{year}"

    raise ValueError(f"Invalid date string: {date_string}")
    

# date_strings = ['2011-11-23', '01.10.2011', 'фев10']
# for date_string in date_strings:
#     converted_date = convert_date_string(date_string)
#     print(f"{converted_date}") 
converted_date1 = convert_date_string(full_data["dob"])
converted_date2 = convert_date_string(full_data["rosatomStarted"])
converted_date3 = convert_date_string(full_data["educ"]["ended"])
print(converted_date1)
print(converted_date2)
print(converted_date3)
