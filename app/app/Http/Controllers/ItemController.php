<?php

namespace App\Http\Controllers;

use App\Models\Todolist;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Item::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stato' =>['required', 'string'],
            'list_id' => ['required', 'exists:todolists,id'],
        ]);

    $item = Item::create($validated);
    return response()->json($item,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        return $item->load('todolist');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'stato' =>['sometimes', 'required', 'string'],
            'list_id' => ['sometimes', 'required', 'exists:todolists,id'],
        ]);
        $item->update($validated);
        return response()->json($item);

    }

    /**
     * Remove the specified resource from storage.
     */
  public function destroy(Request $request, Item $item)
    {
        abort_if($item->todolist->user_id !== $request->user()->id, 403, 'Unauthorized');

        $item->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Task eliminato con successo'
        ], 200);
    }
}
