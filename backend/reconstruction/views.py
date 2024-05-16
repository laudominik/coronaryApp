from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt # Allow request without csrf_token set
from rest_framework.decorators import api_view
from reconstruction.algos.reconstruction import reconstruction


@api_view(['POST']) 
def reconstruction_worker(request):
    if request.method != 'POST':
        return HttpResponse(status=404)

    # TODO: get reconstruction params and validate them
    # TODO: call reconstruction
    print("[RECONSTRUCTION] done")
    pts = reconstruction([])
    flattened = []
    for pt in pts:
        flattened.append(pt[0])
        flattened.append(pt[1])
        flattened.append(pt[2])

    return JsonResponse({"array": flattened})


@api_view(['POST'])
def generator_worker(request):
    pass
