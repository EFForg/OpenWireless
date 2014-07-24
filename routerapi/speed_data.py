import datetime

import common

def getSpeed(data, recency):
    if data == {} :
        return "N/A"
    filtered = dict((key,value) for key, value in data.iteritems() if key > datetime.datetime.now() - datetime.timedelta(seconds=recency))
    if filtered == {} :
        return "N/A"
    data_points = filtered.values()
    return reduce(lambda x, y: x + y, data_points) / len(data_points)
