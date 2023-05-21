import json
import redis,re,ast

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

def convert_date_string(date_string):
   
    match = re.match(r'^(\d{4})-(\d{2})-(\d{2})$', date_string)
    if match:
        year, month, day = match.groups()
        return f"{day}-{month}-{year}"
    
    match = re.match(r'^(\d{2})\.(\d{2})\.(\d{4})$', date_string)
    if match:
        day, month, year = match.groups()
        return f"{day}:{month}:{year}"
    match = re.match(r'^(\d{2})-(\d{2})-(\d{4})$',date_string)
    if match:
        day, month, year = match.groups()
        if int(month) <= 12:
            return f"{month}-{year}"
        else:
            return Null
    match = re.match(r"^(\d{4})$",date_string)
    if match:
        year = match.groups()
        return year[0]
    match = re.match(r'^([а-я]{3})(\d{2})$', date_string.lower())
    if match:
        month_name, year = match.groups()
        month = months[month_name]
        if len(year) == 2:
            year = f"20{year}"
        return f"{month}-{year}"
    match = re.match(r"^(\d{2})-(\d{4})$", date_string)
    if match:
        month,year = match.groups()
        return f"{month}-{year}"
    return Null

def correct_name(name_str):

    corrections = {
        "0": "о",
        '1': 'И',
        '3': 'З',
        '4': 'Ч',
        'a': 'а',
        'b': 'б',
        'c': 'ц',
        'd': 'д',
        'e': 'е',
        'f': 'ф',
        'g': 'г',
        'h': 'х',
        'i': 'и',
        'j': 'й',
        'k': 'к',
        'l': 'л',
        'm': 'м',
        'n': 'н',
        'p': 'п',
        's': 'с',
        't': 'т',
        'u': 'у',
        'v': 'в',
        'w': 'в',
        'y': 'у',
        'z': 'з'
    }
    
    for key, value in corrections.items():
        name_str = name_str.replace(key, value)

    name_parts = name_str.split(' ')
    name_parts = [part.capitalize() for part in name_parts]

    return ' '.join(name_parts)

r = redis.Redis(
    host='127.0.0.1',
    port=6379,
    decode_responses=True
)

sub = r.pubsub()
sub.subscribe("dataset/input")

for i, message in enumerate(sub.listen()):
    print(i)
    print(str(message)[0:100])
    if i != 0:
        input_str = str(message["data"])
        print(input_str[0:20])
        dict1 = json.loads(input_str)
        result_good = []
        all_data = dict1["data"]
        result_data = []
        id = dict1["id"]

        try:
            for n, i in enumerate(all_data):
                fio = correct_name(i["ФИО"])
                educ = 0
                try:
                    trud = convert_date_string(i["Начало трудового стажа"])
                except Exception:
                    trud = Null
                    
                try:
                    dob = convert_date_string(i["Дата рождения"])
                except Exception as e:
                    dob = Null
                    
                try:
                    startwork = convert_date_string(i["Начало трудовой деятельности в РОСАТОМ"])
                except Exception:
                    startwork = Null
                    
                try:
                    endwork = convert_date_string(str(i["Год оканчания"]))
                except Exception:
                    endwork = Null
                    
                try:
                    comp = i["Список компетенций"]
                except Exception:
                    comp = Null
                    
                try:
                    position = i["Должность"]
                except Exception:
                    position = Null
                    
                try:
                    complany = i["Место работы"]
                except Exception:
                    complany = Null
                    
                try:
                    category = i["Специальность"]
                except Exception:
                    category = Null
                try:
                    if i["Образование"] == "Среднее специальное":
                        educ = 2
                    elif i["Образование"] == "Высшее":
                        educ = 4
                except Exception:
                    educ = Null
                try:
                    if i["Участник мероприятия"] != Null and i["Роль в мероприятии"] == "Участник мероприятия":
                        role = True
                    else:
                        role = False
                except Exception:
                    role = Null
                    
                try:
                    place = i["Место образования"]
                except Exception:
                    place = Null
                    
                try:
                    spec = i["Специальность"]
                except Exception:
                    spec = Null
                add = {
                        "id": n+1, 
                        "fio": fio,
                        "gender": int(i["Пол"]), 
                        "dob": dob, 
                        "participating": role,
                        "competitions": comp.split(";").pop(), 
                        "work": {
                            "company": complany,
                            "position": position,
                            "category": category,
                            "workStarted": trud 
                        },
                        "rosatomStarted": startwork, 
                        "education": [
                            {
                                "type": educ, 
                                "place": place,
                                "ended": endwork,
                                "profession": spec
                            }
                        ]
                    }
                result_good.append(add)
            
            r.publish("dataset/output", str({"data": result_good, "id": id}))
            print(result_good[3])
            print(len(result_good))
        except Exception as e:
            print(e)
            print(add)
            r.publish("dataset/output", str({"data": [{"error": "Error with analyzing data"}], "id": id+1000000}))