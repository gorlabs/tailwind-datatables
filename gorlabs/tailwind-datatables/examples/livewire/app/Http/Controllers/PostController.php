<?php

namespace App\Http\Controllers;

use App\DataTables\PostsDataTable;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     * DataTable'ı göstermek için ana view'ı döndürür.
     */
    public function index()
    {
        return view('posts.index');
    }

    /**
     * Process datatables ajax request.
     * Yajra DataTables'tan gelen AJAX isteğini işler ve JSON yanıtı döndürür.
     *
     * @param PostsDataTable $dataTable DataTable sınıfının örneği (dependency injection ile).
     * @return JsonResponse
     */
    public function ajaxData(PostsDataTable $dataTable)
    {
        Log::info('DataTables AJAX isteği parametreleri:', request()->all());
        // DataTable'ın query metodunu kullanarak verileri çeker ve işler.
        return $dataTable->dataTable($dataTable->query(new Post()))->make(true);
    }

    /**
     * Show the form for creating a new resource.
     * Yeni bir post oluşturmak için formu gösterir (modal içinde yüklenecek).
     */
    public function create()
    {
        // Boş bir Post modeli örneği göndererek formun boş başlamasını sağlarız.
        // Bu, `postForm` Alpine bileşeninin `initialPost` config'ini besler.
        return view('tailwind-datatables::datatables.form', ['post' => new Post()]);
    }

    /**
     * Store a newly created resource in storage.
     * Yeni oluşturulan post verilerini veritabanına kaydeder.
     *
     * @param Request $request Gelen HTTP isteği.
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        // Gelen isteği doğrula (validation).
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            // 'is_published' alanı checkbox'tan geldiği için bazen 'on' veya null olabilir.
            // Laravel'in validate'i boolean için bunu otomatik dönüştürebilir,
            // ancak manuel kontrol daha güvenli olabilir.
            'is_published' => 'nullable|boolean', // nullable ekledik
            'published_at' => 'nullable|date',
        ]);

        // published_at alanı boş gelirse null yap veya karbon objesine dönüştür.
        $data = $request->except(['published_at']); // published_at'ı ayrı ele alıyoruz
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;
        $data['is_published'] = (bool) $request->input('is_published', 0); // checkbox değeri varsa true, yoksa false

        $post = Post::create($data); // Post modelini kullanarak yeni kayıt oluştur.

        // Başarılı yanıtı JSON olarak döndür.
        return response()->json(['success' => 'Post başarıyla oluşturuldu.', 'post' => $post]);
    }

    /**
     * Show the form for editing the specified resource.
     * Belirtilen postu düzenlemek için formu gösterir (modal içinde yüklenecek).
     *
     * @param Post $post Düzenlenecek Post modeli (Route Model Binding).
     * @return \Illuminate\View\View
     */
    public function edit(Post $post)
    {
        // `datetime-local` inputu için `YYYY-MM-DDTHH:mm` formatında bir string hazırlıyoruz.
        // Eğer published_at null ise boş string gönderiyoruz.
        $post->published_at_formatted = $post->published_at ? $post->published_at->format('Y-m-d\TH:i') : '';

        // Mevcut post verisini `posts.form` view'ına gönderiyoruz.
        // Bu, `postForm` Alpine bileşeninin `initialPost` config'ini besler.
        return view('tailwind-datatables::datatables.form', compact('post'));
    }

    /**
     * Update the specified resource in storage.
     * Belirtilen post verilerini günceller.
     *
     * @param Request $request Gelen HTTP isteği.
     * @param Post $post Güncellenecek Post modeli.
     * @return JsonResponse
     */
    public function update(Request $request, Post $post)
    {
        //dd($request->all());
        // Gelen isteği doğrula.
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean|nullable', // nullable ekledik
            'published_at' => 'nullable|date',
        ]);

        $data = $request->except(['published_at']); // published_at'ı ayrı ele alıyoruz
        $data['is_published'] = (bool) $request->input('is_published', 0); // checkbox değeri varsa true, yoksa false
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;
        //dd($data);
        $post->update($data); // Post modelini kullanarak kaydı güncelle.

        // Başarılı yanıtı JSON olarak döndür.
        return response()->json(['success' => 'Post başarıyla güncellendi.', 'post' => $post]);
    }

    /**
     * Remove the specified resource from storage.
     * Belirtilen postu veritabanından siler.
     *
     * @param Post $post Silinecek Post modeli.
     * @return JsonResponse
     */
    public function destroy(Post $post)
    {
        try {
            $post->delete();
            return response()->json(['success' => 'Post başarıyla silindi.']);
        } catch (\Exception $e) {
            // Hata durumunda loglama ve hata mesajı döndürme
            Log::error('Post silinirken hata oluştu: ' . $e->getMessage(), ['post_id' => $post->id]);
            return response()->json(['error' => 'Post silinirken bir hata oluştu.'], 500);
        }
    }
}
