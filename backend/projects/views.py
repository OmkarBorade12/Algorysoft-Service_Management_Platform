# pyre-ignore-all-errors
"""
Views for the projects app. These views handle API requests.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Category, Project, CustomRequest, Order, Feature, BasicCard, PricingCard
from .serializers import (
    CategorySerializer,
    ProjectSerializer,
    CustomRequestSerializer,
    OrderSerializer,
    FeatureSerializer,
    BasicCardSerializer,
    PricingCardSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer


class BasicCardViewSet(viewsets.ModelViewSet):
    """Singleton-style BasicCard – only one record used (id=1)."""
    queryset = BasicCard.objects.all()
    serializer_class = BasicCardSerializer


class PricingCardViewSet(viewsets.ModelViewSet):
    queryset = PricingCard.objects.all().order_by('-created_at')
    serializer_class = PricingCardSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_fields = ['category__slug', 'featured', 'is_new']
    search_fields = ['title', 'description', 'tech']
    ordering_fields = ['price', 'views', 'discount']


class CustomRequestViewSet(viewsets.ModelViewSet):
    queryset = CustomRequest.objects.all()
    serializer_class = CustomRequestSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().partial_update(request, *args, **kwargs)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Count

@api_view(['GET'])
@permission_classes([AllowAny])
def landing_stats(request):
    """Provides public stats for the landing page."""
    # Count orders that are not Cancelled or Pending
    order_count = Order.objects.exclude(status__in=['Cancelled', 'Pending']).count()
    request_count = CustomRequest.objects.filter(status__in=['Approved', 'In Development']).count()
    
    # Total unique clients (based on email)
    order_emails = Order.objects.values_list('client_email', flat=True).distinct()
    request_emails = CustomRequest.objects.values_list('email', flat=True).distinct()
    
    unique_emails = set(list(order_emails) + list(request_emails))
    
    return Response({
        'websites_delivered': order_count + request_count,
        'happy_businesses': len(unique_emails),
        'avg_rating': '5.0',
    })
