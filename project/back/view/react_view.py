import os

from django.http import FileResponse


def react_app(request):
    build_path = 'static/build'
    filename = build_path + request.path
    if not os.path.isfile(filename):
        filename = build_path + '/index.html'

    response = FileResponse(open(filename, 'rb'))
    return response