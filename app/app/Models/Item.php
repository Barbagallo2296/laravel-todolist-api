<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'stato',
        'list_id',
    ];

    // Questa relazione deve indicare 'list_id' come chiave esterna custom!
    public function todolist()
    {
        return $this->belongsTo(Todolist::class, 'list_id');
    }
}