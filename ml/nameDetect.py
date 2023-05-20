def correct_name(name_str):

    corrections = {
        '1': 'И',
        '3': 'З',
        '4': 'Ч',
        'f': 'ф',
        'n': 'н',
        'k': 'к',
        'm': 'м',
        'n': 'н',
        '0': 'O',
        'O': '0',
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
        'o': 'о',
        'p': 'п',
        'r': 'р',
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

name_str1 = 'Кукл1н ант0н эдуАрд0вич'
corrected_name1 = correct_name(name_str1)
print(corrected_name1)

name_str2 = 'иванов петр семеновнА'
corrected_name2 = correct_name(name_str2)
print(corrected_name2)