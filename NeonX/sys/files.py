import os
# DEVELOPMENT

def writeFile(file, contents):
    f = open(file, "w")
    f.write(contents)
    f.close()
    return 0

def deleteFile(file):
    os.remove(file)
    return 0
