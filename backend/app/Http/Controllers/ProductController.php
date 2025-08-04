<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Liste des produits avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('categorie')->actifs();

        // Recherche par nom ou description
        if ($request->has('recherche') && $request->recherche) {
            $query->recherche($request->recherche);
        }

        // Filtrer par catégorie
        if ($request->has('categorie') && $request->categorie) {
            $query->parCategorie($request->categorie);
        }

        // Filtrer par prix
        if ($request->has('prix_min') || $request->has('prix_max')) {
            $query->parPrix($request->prix_min, $request->prix_max);
        }

        // Filtrer par marque
        if ($request->has('marque') && $request->marque) {
            $query->where('marque', $request->marque);
        }

        // Filtrer les produits en stock seulement
        if ($request->has('en_stock') && $request->en_stock === 'true') {
            $query->enStock();
        }

        // Filtrer les promotions
        if ($request->has('promotion') && $request->promotion === 'true') {
            $query->enPromotion();
        }

        // Tri
        $tri = $request->get('tri', 'nom');
        $ordre = $request->get('ordre', 'asc');
        
        switch ($tri) {
            case 'prix':
                $query->orderBy('prix', $ordre);
                break;
            case 'date':
                $query->orderBy('created_at', $ordre);
                break;
            case 'popularite':
                // Tri par nombre de ventes (nécessiterait une relation)
                $query->orderBy('nom', $ordre);
                break;
            default:
                $query->orderBy('nom', $ordre);
        }

        $perPage = $request->get('per_page', 12);
        $produits = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($produits->items()),
            'pagination' => [
                'current_page' => $produits->currentPage(),
                'last_page' => $produits->lastPage(),
                'per_page' => $produits->perPage(),
                'total' => $produits->total(),
                'from' => $produits->firstItem(),
                'to' => $produits->lastItem(),
            ],
            'filtres' => [
                'categories' => Category::actives()->ordonnees()->get(['id', 'nom']),
                'marques' => Product::distinct()->pluck('marque')->filter()->sort()->values(),
                'prix_min' => Product::min('prix'),
                'prix_max' => Product::max('prix'),
            ]
        ]);
    }

    /**
     * Afficher un produit spécifique
     */
    public function show(string $id): JsonResponse
    {
        $produit = Product::with('categorie')->find($id);

        if (!$produit || !$produit->actif) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ProductResource($produit)
        ]);
    }

    /**
     * Créer un nouveau produit (Admin seulement)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'marque' => 'nullable|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'poids' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'dimensions.longueur' => 'nullable|numeric|min:0',
            'dimensions.largeur' => 'nullable|numeric|min:0',
            'dimensions.hauteur' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $produit = Product::create([
                'nom' => $request->nom,
                'description' => $request->description,
                'slug' => Str::slug($request->nom),
                'prix' => $request->prix,
                'stock' => $request->stock,
                'category_id' => $request->category_id,
                'marque' => $request->marque,
                'sku' => $request->sku,
                'poids' => $request->poids,
                'dimensions' => $request->dimensions,
                'actif' => true,
                'meta_title' => $request->nom . ' - Boutique en ligne',
                'meta_description' => Str::limit($request->description, 160),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => new ProductResource($produit->load('categorie'))
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du produit'
            ], 500);
        }
    }

    /**
     * Mettre à jour un produit (Admin seulement)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $produit = Product::find($id);

        if (!$produit) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'marque' => 'nullable|string|max:255',
            'sku' => 'sometimes|required|string|unique:products,sku,' . $id,
            'poids' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $produit->update($request->only([
                'nom', 'description', 'prix', 'stock', 'category_id',
                'marque', 'sku', 'poids', 'dimensions'
            ]));

            if ($request->has('nom')) {
                $produit->slug = Str::slug($request->nom);
                $produit->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => new ProductResource($produit->load('categorie'))
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du produit'
            ], 500);
        }
    }

    /**
     * Supprimer un produit (Admin seulement)
     */
    public function destroy(string $id): JsonResponse
    {
        $produit = Product::find($id);

        if (!$produit) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        try {
            $produit->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit'
            ], 500);
        }
    }

    /**
     * Basculer le statut actif/inactif d'un produit
     */
    public function toggleStatus(string $id): JsonResponse
    {
        $produit = Product::find($id);

        if (!$produit) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        $produit->actif = !$produit->actif;
        $produit->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut du produit mis à jour',
            'data' => new ProductResource($produit->load('categorie'))
        ]);
    }

    /**
     * Mettre à jour le stock d'un produit
     */
    public function updateStock(Request $request, string $id): JsonResponse
    {
        $produit = Product::find($id);

        if (!$produit) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Stock invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        $produit->stock = $request->stock;
        $produit->save();

        return response()->json([
            'success' => true,
            'message' => 'Stock mis à jour',
            'data' => new ProductResource($produit->load('categorie'))
        ]);
    }

    /**
     * Obtenir les produits les plus vendus
     */
    public function topProducts(): JsonResponse
    {
        // Cette méthode nécessiterait une relation avec les ventes
        // Pour l'instant, on retourne les produits les plus récents
        $produits = Product::with('categorie')
                          ->actifs()
                          ->orderBy('created_at', 'desc')
                          ->limit(10)
                          ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($produits)
        ]);
    }

    /**
     * Obtenir les produits avec stock faible
     */
    public function lowStock(): JsonResponse
    {
        $produits = Product::with('categorie')
                          ->actifs()
                          ->where('stock', '<=', 5)
                          ->orderBy('stock', 'asc')
                          ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($produits)
        ]);
    }
}