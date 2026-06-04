<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Todolist;
use Illuminate\Http\Request;

class TodolistController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->todolists);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $todolist = $request->user()->todolists()->create($validated);
        return response()->json($todolist, 201);
    }

    public function show(Request $request, Todolist $todolist)
    {
        abort_if($todolist->user_id !== $request->user()->id, 403, 'Unauthorized');
        return response()->json($todolist->load(['items']));
    }

    public function update(Request $request, Todolist $todolist)
    {
        abort_if($todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string'],
            'description' => ['nullable', 'string']
        ]);

        $todolist->update($validated);
        return response()->json($todolist);
    }

  public function destroy(Request $request, Todolist $todolist)
{
    abort_if($todolist->user_id !== $request->user()->id, 403, 'Unauthorized');
    
    $todolist->delete();
    
    return response()->json([
        'success' => true,
        'message' => 'Lista eliminata con successo'
    ], 200);
}

    public function items(Request $request, Todolist $todolist)
    {
        abort_if($todolist->user_id !== $request->user()->id, 403, 'Unauthorized');
        return response()->json($todolist->items);
    }
}