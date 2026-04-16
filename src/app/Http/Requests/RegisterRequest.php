<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Имя обязательно',
            'email.required' => 'Email обязателен',
            'email.email' => 'Некорректный email',
            'email.unique' => 'Email уже занят',
            'password.required' => 'Пароль обязателен',
            'password.confirmed' => 'Пароли не совпадают',
            'password.min' => 'Пароль должен быть минимум 8 символов',
            'password.mixed' => 'Пароль должен содержать заглавные и строчные буквы',
            'password.numbers' => 'Пароль должен содержать цифры',
        ];
    }
}
