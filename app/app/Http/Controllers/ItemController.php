<?php

namespace App\Http\Controllers;

use App\Models\Todolist;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource (solo i task dell'utente autenticato).
     */
    public function index(Request $request)
    {
        return Item::whereHas('todolist', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stato' => ['required', 'string'],
            'list_id' => ['required', 'exists:todolists,id'],
        ]);

        $todolist = Todolist::findOrFail($validated['list_id']);
        abort_if($todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        $item = Item::create($validated);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Item $item)
    {
        abort_if($item->todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        return $item->load('todolist');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        abort_if($item->todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'stato' => ['sometimes', 'required', 'string'],
            'list_id' => ['sometimes', 'required', 'exists:todolists,id'],
        ]);

        if (isset($validated['list_id'])) {
            $newTodolist = Todolist::findOrFail($validated['list_id']);
            abort_if($newTodolist->user_id !== $request->user()->id, 403, 'Unauthorized');
        }

        $item->update($validated);
        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Item $item)
    {
        abort_if(!$item->todolist || $item->todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        $item->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Task eliminato con successo'
        ], 200);
    }
}