import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'algorysoft.settings')
django.setup()

from projects.models import Category, Project

def seed():
    # Clear existing
    Project.objects.all().delete()
    Category.objects.all().delete()

    # Create Categories
    categories = [
        {'name': 'E-Commerce', 'slug': 'e-commerce', 'icon': 'FiShoppingBag'},
        {'name': 'SaaS Apps', 'slug': 'saas-apps', 'icon': 'FiGrid'},
        {'name': 'Landing Pages', 'slug': 'landing-pages', 'icon': 'FiLayout'},
        {'name': 'Corporate Sites', 'slug': 'corporate-sites', 'icon': 'FiBriefcase'},
        {'name': 'Booking Systems', 'slug': 'booking-systems', 'icon': 'FiCalendar'},
    ]
    
    cat_objs = {}
    for c in categories:
        cat = Category.objects.create(**c)
        cat_objs[c['name']] = cat
        print(f"Created Category: {cat.name}")

    # Create Projects
    projects = [
        {
            'title': 'Premium E-Commerce Store',
            'slug': 'premium-e-commerce-store',
            'category': cat_objs['E-Commerce'],
            'price': 24999,
            'original_price': 49999,
            'discount': 50,
            'featured': True,
            'is_new': True,
            'description': 'A high-converting, premium e-commerce store with advanced features.',
            'tech': ['Next.js', 'Redux', 'Django', 'PostgreSQL'],
            'icon': '🛒'
        },
        {
            'title': 'SaaS Dashboard Template',
            'slug': 'saas-dashboard-template',
            'category': cat_objs['SaaS Apps'],
            'price': 19999,
            'original_price': 39999,
            'discount': 50,
            'featured': True,
            'is_new': False,
            'description': 'Modern SaaS dashboard with real-time analytics and user management.',
            'tech': ['React', 'Tailwind', 'Python', 'WebSockets'],
            'icon': '📊'
        },
        {
            'title': 'High-Performance Landing Page',
            'slug': 'landing-page-v1',
            'category': cat_objs['Landing Pages'],
            'price': 4999,
            'original_price': 9999,
            'discount': 50,
            'featured': False,
            'is_new': True,
            'description': 'Ultra-fast landing page designed for maximum conversion rates.',
            'tech': ['HTML', 'CSS', 'JS', 'Framer Motion'],
            'icon': '🚀'
        }
    ]

    for p in projects:
        proj = Project.objects.create(**p)
        print(f"Created Project: {proj.title}")

if __name__ == '__main__':
    seed()
