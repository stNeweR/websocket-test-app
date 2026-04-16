<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $otherUserId = $request->query('user_id');

        $messages = Message::query()->orderBy('created_at', 'desc')->get();
//        $messages = Message::where(function ($query) use ($userId, $otherUserId) {
//            $query->where('sender_id', $userId);
//        })->orWhere(function ($query) use ($userId, $otherUserId) {
//            $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
//        })->orderBy('created_at', 'asc')->get();

        return response()->json(['messages' => $messages]);
    }

    public function store(SendMessageRequest $request): JsonResponse
    {
        $message = Message::create([
            'sender_id' => $request->user()->id,
            'content' => $request->validated('content'),
        ]);

        return response()->json(['message' => $message], 201);
    }
}
