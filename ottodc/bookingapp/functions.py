import openpyxl


def excel_sheet_data_extraction(file: str):
    wb = openpyxl.load_workbook(file)
    header = []
    body = []
    firstrow = 1
    wrksheet = wb.active
    for row in wrksheet:
        list = []
        for ro in row:
            list.append(ro.value)
        if firstrow == 1:
            header.append(list)
        else:
            body.append(list)
        firstrow = 0
    return body