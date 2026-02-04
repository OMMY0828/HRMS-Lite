from django.urls import path
from . import views

urlpatterns = [
    path('employees', views.employees_list_create),
    path('employees/<str:emp_id>', views.employees_detail),
    path('leave', views.leave_list_create),
    path('attendance', views.attendance_list_create),
]
