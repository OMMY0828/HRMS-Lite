import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from bson import ObjectId
from .db import db
import json



def oid_str(doc):
    if not doc:
        return None
    doc['_id'] = str(doc['_id'])
    return doc


def list_to_json(docs):
    return [oid_str(d) for d in docs]


def json_response(data, status=200):
    return JsonResponse(data, safe=False, status=status)


def parse_body(request):
    try:
        return json.loads(request.body.decode('utf-8')) if request.body else {}
    except Exception:
        return {}


@csrf_exempt
def employees_list_create(request):
    if request.method == 'GET':
        docs = list(db.employees.find().limit(500))
        return json_response(list_to_json(docs))
    if request.method == 'POST':
        data = parse_body(request)
        try:
            # required fields: employee_id, full_name
            emp_id = data.get('employee_id')
            full_name = data.get('full_name')
            if not emp_id or not full_name:
                return json_response({'error': 'employee_id and full_name are required'}, status=400)

            # check uniqueness of employee_id
            existing = db.employees.find_one({'employee_id': emp_id})
            if existing:
                return json_response({'error': 'employee_id already exists'}, status=409)

            doc = {
                'employee_id': emp_id,
                'full_name': full_name,
                'email': data.get('email', ''),
                'department': data.get('department', ''),
            }
            res = db.employees.insert_one(doc)
            doc['_id'] = str(res.inserted_id)
            return json_response(doc, status=201)
        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            # print to server console for debugging
            print('Error in employees_list_create POST:', e)
            print(tb)
            return json_response({'error': 'server error', 'detail': str(e), 'trace': tb}, status=500)
    return json_response({'error': 'method not allowed'}, status=405)


@csrf_exempt
def employees_detail(request, emp_id):
    try:
        oid = ObjectId(emp_id)
    except Exception:
        return json_response({'error': 'invalid id'}, status=400)

    if request.method == 'GET':
        doc = db.employees.find_one({'_id': oid})
        if not doc:
            return json_response({'error': 'not found'}, status=404)
        return json_response(oid_str(doc))

    if request.method == 'PUT':
        data = parse_body(request)
        update = {k: v for k, v in data.items() if k in ['full_name', 'email', 'department']}
        db.employees.update_one({'_id': oid}, {'$set': update})
        doc = db.employees.find_one({'_id': oid})
        return json_response(oid_str(doc))

    if request.method == 'DELETE':
        db.employees.delete_one({'_id': oid})
        return json_response({'deleted': True})

    return json_response({'error': 'method not allowed'}, status=405)


@csrf_exempt
def leave_list_create(request):
    if request.method == 'GET':
        docs = list(db.leaves.find().limit(500))
        return json_response(list_to_json(docs))
    if request.method == 'POST':
        data = parse_body(request)
        doc = {
            'employee_id': data.get('employee_id'),
            'start_date': data.get('start_date'),
            'end_date': data.get('end_date'),
            'reason': data.get('reason', ''),
            'status': 'pending'
        }
        res = db.leaves.insert_one(doc)
        doc['_id'] = str(res.inserted_id)
        return json_response(doc, status=201)
    return json_response({'error': 'method not allowed'}, status=405)


@csrf_exempt
def attendance_list_create(request):
    if request.method == 'GET':
        # optional filter by employee_id
        emp = request.GET.get('employee_id') if hasattr(request, 'GET') else None
        if emp:
            docs = list(db.attendance.find({'employee_id': emp}).sort('date', -1).limit(500))
        else:
            docs = list(db.attendance.find().sort('date', -1).limit(500))
        return json_response(list_to_json(docs))
    if request.method == 'POST':
        data = parse_body(request)
        employee_id = data.get('employee_id')
        date = data.get('date')
        status = data.get('status', 'Present')
        
        if not employee_id or not date:
            return json_response({'error': 'employee_id and date are required'}, status=400)
        
        # Check if attendance already exists for this employee on this date
        existing = db.attendance.find_one({'employee_id': employee_id, 'date': date})
        if existing:
            # Update existing record
            db.attendance.update_one(
                {'employee_id': employee_id, 'date': date},
                {'$set': {'status': status}}
            )
            doc = db.attendance.find_one({'employee_id': employee_id, 'date': date})
            return json_response(oid_str(doc))
        else:
            # Create new record
            doc = {
                'employee_id': employee_id,
                'date': date,
                'status': status
            }
            res = db.attendance.insert_one(doc)
            doc['_id'] = str(res.inserted_id)
            return json_response(doc, status=201)
    return json_response({'error': 'method not allowed'}, status=405)
