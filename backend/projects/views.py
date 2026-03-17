from rest_framework import viewsets
from .models import Category, Project
from .serializers import CategorySerializer, ProjectSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_fields = ['category__slug', 'featured', 'is_new']
    search_fields = ['title', 'description', 'tech']
    ordering_fields = ['price', 'views', 'discount']
