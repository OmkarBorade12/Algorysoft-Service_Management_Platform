# pyre-ignore-all-errors
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProjectViewSet, CustomRequestViewSet, OrderViewSet,
    FeatureViewSet, BasicCardViewSet, PricingCardViewSet, landing_stats
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'requests', CustomRequestViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'features', FeatureViewSet)
router.register(r'basic-card', BasicCardViewSet)
router.register(r'pricing-cards', PricingCardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('landing-stats/', landing_stats, name='landing-stats'),
]
