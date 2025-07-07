<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // PostController için rotalar

    // Inertia tarafından render edilecek Post listesi sayfası
    Route::resource('posts', \App\Http\Controllers\PostController::class);
    // DataTables'ın AJAX istekleriyle veri alacağı API endpoint'i de aynı index metodu üzerinden yönetilecek.
    Route::get('/posts-data', [\App\Http\Controllers\PostController::class, 'ajaxData'])->name('posts.data');
});

require __DIR__.'/auth.php';
