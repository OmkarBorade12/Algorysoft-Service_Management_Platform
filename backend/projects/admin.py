from django.contrib import admin
from .models import Category, Project, CustomRequest, Order, OrderItem, Feature, BasicCard, PricingCard

admin.site.register(Category)
admin.site.register(Project)
admin.site.register(CustomRequest)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Feature)
admin.site.register(BasicCard)
admin.site.register(PricingCard)
