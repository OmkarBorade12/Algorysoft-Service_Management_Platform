import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'algorysoft.settings')
django.setup()

from projects.models import Category, Project

print(f"Categories: {Category.objects.count()}")
for cat in Category.objects.all():
    print(f" - {cat.name} ({cat.slug})")

print(f"Projects: {Project.objects.count()}")
for proj in Project.objects.all():
    print(f" - {proj.title} (Category: {proj.category.name if proj.category else 'None'})")
