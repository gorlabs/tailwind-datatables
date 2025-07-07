<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

require __DIR__.'/auth.php';
// Yeni Eklenen Post Rotları
Route::resource('posts', PostController::class);
Route::get('posts-data', [PostController::class, 'ajaxData'])->name('posts.data');
